<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useApp } from '@/store/app'
import { listRestaurants, submitCartAsOrder } from '@/service/mock'
import CustomTabbar from '@/components/CustomTabbar.vue'
import customNavbar from '../food/components/customNavbar.vue'
import { postToPool, createCustomerView, type PoolOrder } from '@/service/orderFlow'

const app = useApp()

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
</script>


<template>
    <view class="page">
        <customNavbar />
        <scroll-view scroll-y class="page-scroll">
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

            <view style="height:72px" />
        </scroll-view>

        <CustomTabbar />
    </view>
</template>

<style scoped>
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
</style>
