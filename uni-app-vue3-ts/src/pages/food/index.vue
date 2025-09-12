<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useApp } from '@/store/app'
import { listRestaurants, submitCartAsOrder } from '@/service/mock'
import CustomTabbar from '@/components/CustomTabbar.vue'
import sdswiper from '@/components/sdSwiper.vue'
import categoryPanel from './components/categoryPanel.vue'
import customNavbar from '../food/components/customNavbar.vue'
import hotPanel from './components/hotPanel.vue'
import { postToPool, createCustomerView, type PoolOrder } from '@/service/orderFlow'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/service/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import SdGuess from '@/components/sdGuess.vue'
import { useGuessList } from '@/composables/index'
import PageSkeleton from './components/PageSkeleton.vue'

const { safeAreaInsets } = uni.getSystemInfoSync();
const navHeight = `calc(160rpx  + ${safeAreaInsets?.top ?? 0}px)`
const tabbarHeight = 56 + (safeAreaInsets?.bottom ?? 0)

const app = useApp()
// 获取轮播数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
    const res = await getHomeBannerAPI()
    console.log('res', res)
    bannerList.value = res.result
}


//获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
    const res = await getHomeCategoryAPI()
    console.log('res', res)
    categoryList.value = res.result
}

//获取热门推荐数据
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
    const res = await getHomeHotAPI()
    console.log('res', res)
    hotList.value = res.result
}

const isLoading = ref(false)

onLoad(() => {
    isLoading.value = true
    Promise.all([getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData()])
    isLoading.value = false
})


const restaurants = ref<any[]>([])
const loading = ref(true)

onShow(async () => {
    loading.value = true
    restaurants.value = await listRestaurants()
    loading.value = false
})

function add(rid: string, d: any) {
    if (!app.user.registered) return uni.showToast({ title: '请先注册', icon: 'none' })
    if (!app.user.sex) return uni.showToast({ title: '请选择性别', icon: 'none' })
    app.cart.items.push({ restaurantId: rid, dishId: d.id, qty: 1 })
}
const cartCount = () => app.cart.items.length

const selectedAddr = ref('')
function onAddrChange(e: { detail: { value: string } }) {
    const i = +e.detail.value
    selectedAddr.value = app.user.addresses[i]?.value || ''
}

async function submitCart() {
    if (!app.user.registered) return uni.showToast({ title: '请先注册', icon: 'none' })
    if (!app.user.sex) return uni.showToast({ title: '请选择性别', icon: 'none' })
    if (!app.user.phone) return uni.showToast({ title: '请先在“我的”填写手机号', icon: 'none' })
    if (cartCount() === 0) return uni.showToast({ title: '购物车为空', icon: 'none' })
    if (!selectedAddr.value) return uni.showToast({ title: '请选择送达地址', icon: 'none' })

    const summary = selectedAddr.value
    const fee = app.fees.food ?? 3
    const order = await submitCartAsOrder({ summary, fee, customerSex: app.user.sex })

    // one canonical PoolOrder
    const poolOrder: PoolOrder = {
        ...order,
        drop: summary,
        type: 'food',
        status: 'POSTED'
    }

    // customer view + pool
    app.orders.myOrders.push(createCustomerView(poolOrder))
    postToPool(app, poolOrder)

    app.cart.items = []
    uni.showToast({ title: '已提交（mock）', icon: 'success' })
}

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()
// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
    // 开始动画
    isTriggered.value = true
    // 加载数据
    // await getHomeBannerData()
    // await getHomeCategoryData()
    // await getHomeHotData()
    // 重置猜你喜欢组件数据
    guessRef.value?.resetData()
    const tasks: Promise<any>[] = [
        getHomeBannerData(),
        getHomeCategoryData(),
        getHomeHotData(),
    ]
    if (guessRef.value) tasks.push(guessRef.value.getMore())
    await Promise.all([
        tasks]
    )

    // 关闭动画
    isTriggered.value = false
}
</script>


<template>
    <view class="page">
        <customNavbar class="nav" />
        <view :style="{ height: navHeight }"></view>

        <scroll-view enable-back-to-top :refresher-enabled="true" lower-threshold="120"
            @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTriggered" @scrolltolower="onScrolltolower"
            scroll-y class="page-scroll">
            <PageSkeleton v-if="isLoading" />

            <template v-else>
                <sdswiper :list="bannerList" />
                <categoryPanel :list="categoryList" />
                <hotPanel :list="hotList" />

                <view v-if="loading" class="loading">Loading…</view>

                <view v-for="r in restaurants" :key="r.id" class="card">
                    <view class="h">{{ r.name }}</view>
                    <view v-for="d in r.dishes" :key="d.id" class="row">
                        <text>{{ d.name }} ¥{{ d.price }}</text>
                        <button size="mini" @tap="add(r.id, d)">Add</button>
                    </view>
                </view>

                <view class="card" v-if="app.user.role === 'customer'">
                    <view class="h">送达地址</view>
                    <picker mode="selector" :range="app.user.addresses" range-key="label" @change="onAddrChange">
                        <view class="addr-box">{{ selectedAddr || '请选择（精确到房间号）' }}</view>
                    </picker>
                </view>

                <view class="cart">
                    <text>Cart: {{ cartCount() }} item(s)</text>
                    <button type="primary" :disabled="cartCount() === 0 || !app.user.registered" @tap="submitCart">
                        Submit Cart (¥{{ app.fees.food ?? 3 }})
                    </button>
                    <view v-if="!app.user.registered" class="hint">请先在“我的”完成注册并选择性别</view>
                </view>

                <SdGuess ref="guessRef" />
                <!--  for bottom spacing -->
                <view :style="{ height: tabbarHeight + 'px' }" />
            </template>
        </scroll-view>

        <CustomTabbar />
    </view>
</template>

<style scoped>
.page {
    height: 100vh;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
}

.nav {

    position: fixed;
    /* top: var(--window-top, 0px); */
    left: var(--window-left, 0px);
    /* respect safe area */
    right: var(--window-right, 0px);
    /* respect safe area */
    /* height: 44px; */
    /* display: flex; */
    align-items: center;
    /* padding: 0 12px; */
    box-sizing: border-box;
    /* padding won't change width */
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .06);
    z-index: 2000;
}

.page-scroll {
    flex: 1;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 48px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    background: #111;
    color: #fff;
    z-index: 9999;
}

.title {
    font-weight: 600;
}


.loading {
    padding: 12px;
    color: #888;
}

.card {
    margin: 8px 0;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 12px;
}

.h {
    font-weight: 600;
    margin-bottom: 6px;
}

.row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
}

.addr-box {
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 8px;
}

.cart {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.hint {
    color: #888;
}

/* you already have this */
</style>
