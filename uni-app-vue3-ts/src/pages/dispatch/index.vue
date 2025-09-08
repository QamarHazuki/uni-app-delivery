<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useApp } from '@/store/app'
import { listDispatchPool } from '@/service/mock'
import CustomTabbar from '@/components/CustomTabbar.vue'
import customTopbar from '@/components/customTopbar.vue'
import { acceptOrder, updateFee, type PoolOrder } from '@/service/orderFlow'

const app = useApp()

/* -------- seed once -------- */
const seeded = ref(false)
onShow(async () => {
    if (seeded.value) return
    const r = await listDispatchPool()
    if (r?.orders?.length) {
        const m = new Map(app.orders.availablePool.map((o: any) => [o.id, o]))
        for (const o of r.orders) m.set(o.id, o)
        app.orders.availablePool = Array.from(m.values())
    }

    app.orders.onlineCouriers = [
        { id: 'c1', name: '张三', sex: 'male', active: 2 },
        { id: 'c2', name: '李四', sex: 'female', active: 1 },
        { id: 'c3', name: 'Courier 3', sex: 'male', active: 0 },
    ]

    seeded.value = true
})

/* -------- UI state -------- */
const sortDesc = ref(true)
const search = ref('')
type TypeKey = 'all' | 'food' | 'package'
const typeFilter = ref<TypeKey>('all')
const typeLabel = computed(() =>
    typeFilter.value === 'all' ? '全部' : typeFilter.value === 'food' ? '餐' : '件'
)
function cycleType() {
    typeFilter.value = typeFilter.value === 'all' ? 'food'
        : typeFilter.value === 'food' ? 'package'
            : 'all'
}

/* my posted ids */
const myPostedIds = computed(
    () => new Set(
        app.orders.myOrders
            .filter(o => o.mineAs === 'customer' && (o.status === 'CREATED' || o.status === 'POSTED'))
            .map(o => o.id)
    )
)

/* -------- visible orders (left) -------- */
const visibleOrders = computed<PoolOrder[]>(() => {
    let list = app.orders.availablePool.filter((o: any) => o.status === 'POSTED')

    if (typeFilter.value !== 'all') list = list.filter(o => (o.type || 'unknown') === typeFilter.value)
    if (search.value.trim()) {
        const q = search.value.trim()
        list = list.filter(o => (o.pickup || '').includes(q) || (o.drop || '').includes(q))
    }

    list.sort((a, b) => {
        const fa = Number(a.fee ?? 0), fb = Number(b.fee ?? 0)
        return sortDesc.value ? fb - fa : fa - fb
    })
    return list as any
})

/* -------- actions -------- */
const canAccept = (o: PoolOrder) =>
    app.user.role === 'courier' && app.user.online && o.status === 'POSTED'

function doAccept(id: string) {
    if (app.user.role !== 'courier') return
    if (!app.user.registered) return uni.showToast({ title: '请先注册', icon: 'none' })
    if (!app.user.sex) return uni.showToast({ title: '请选择性别', icon: 'none' })
    if (!app.user.online) return uni.showToast({ title: '请先上线', icon: 'none' })
    if (acceptOrder(app, id)) uni.showToast({ title: 'Accepted', icon: 'success' })
}

const isMineAndPosted = (o: PoolOrder) => myPostedIds.value.has(o.id)
function showReprice(o: PoolOrder) {
    if (app.user.role !== 'customer' || !isMineAndPosted(o)) return
    uni.showActionSheet({
        itemList: ['+1', '-1'],
        success: res => {
            const delta = res.tapIndex === 0 ? +1 : -1
            const next = Math.max(0, Number(o.fee ?? 0) + delta)
            updateFee(app, o.id, next)
        }
    })
}

/* display helpers */
const leftTitle = (o: PoolOrder) => {
    if (app.user.role === 'courier') return `${o.pickup || ''} → ${o.drop || ''}`.trim()
    if (o.type === 'food') return `餐厅: ${o.pickup || '—'}`
    if (o.type === 'package') return `站点: ${o.pickup || '—'}`
    return `${o.pickup || ''}`.trim()
}

/* right column mock */
const onlineCouriers = computed(() => app.orders.onlineCouriers || [])
</script>

<template>
    <customTopbar />

    <view class="page">

        <!-- toolbar (kept) -->
        <view class="toolbar">
            <view class="search-box">
                <image class="search-icon" src="@/static/tabs/search.png" />
                <input class="search-input" v-model="search" placeholder="搜索 取/送 地址" />
            </view>
            <text class="tab" @tap="cycleType">{{ typeLabel }}</text>

            <view class="price-toggle" @tap="sortDesc = !sortDesc">
                <text class="tab">价格</text>
                <view class="tris">
                    <text :class="['tri up', !sortDesc ? 'active' : '']">▲</text>
                    <text :class="['tri down', sortDesc ? 'active' : '']">▼</text>
                </view>
            </view>
        </view>


        <!-- column titles  -->
        <view class="cols-head">
            <text class="col-title">订单</text>
            <text class="col-title">在线骑手</text>
        </view>


        <!-- two columns with a permanent vertical divider -->
        <view class="two-col">
            <!-- LEFT orders -->
            <view class="col left">
                <scroll-view scroll-y class="list nosb" :show-scrollbar="false">
                    <view v-if="!visibleOrders.length" class="empty">暂无可接订单</view>

                    <view v-for="o in visibleOrders" :key="o.id" class="row">
                        <!-- left main (two text lines) -->
                        <view class="left-main">
                            <view class="line1">
                                <text class="chip">{{ o.type || 'unknown' }}</text>
                                <text class="title">{{ leftTitle(o) }}</text>
                            </view>
                            <view class="line2">
                                <text class="meta">{{ o.type === 'food' ? '已汇总购物车' : '包裹信息·取件码等' }}</text>
                                <text class="date">date</text>
                                <button v-if="app.user.role === 'courier'" size="mini" class="btn-ghost"
                                    :disabled="!canAccept(o)" @tap="doAccept(o.id)">接受</button>
                            </view>
                        </view>

                        <!-- right rail: price on top, 改价 below -->
                        <view class="right-rail">
                            <text class="fee">¥{{ o.fee ?? 0 }}</text>
                            <button v-if="isMineAndPosted(o)" class="btn-ghost btn-reprice"
                                @tap="showReprice(o)">改价</button>
                        </view>
                    </view>
                </scroll-view>
            </view>


            <!-- the vertical divider -->
            <view class="vline" />

            <view class="col right">
                <scroll-view scroll-y class="list nosb" :show-scrollbar="false">
                    <view v-if="!onlineCouriers.length" class="empty">暂无</view>
                    <view v-for="c in onlineCouriers" :key="c.id" class="row">
                        <view class="line1">
                            <text class="title">{{ c.name || ('Courier ' + c.id) }}</text>
                        </view>
                        <view class="line2">
                            <text class="meta" v-if="c.sex">{{ c.sex === 'male' ? '男' : '女' }}</text>
                            <text class="meta" v-if="c.active > 0"> · 单 {{ c.active }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <CustomTabbar />
    </view>
</template>



<style scoped>
/* page padding kept minimal */
.page {
    padding: 0 8px;
}

/* Toolbar  */
.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-bottom: 0 !important;
    margin-bottom: 6px;
}

.search-box {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 8px;
    width: 10px;
    height: 10px;
}

/* 10x10 */
.search-input {
    flex: 1;
    font-size: 11px;
    /* 10px */
    padding: 8px 8px 8px 30px;
    border: 1px solid #eee;
    border-radius: 1px;
    height: 30px;
    line-height: 1.4;
}

.tab {
    font-size: 11px;
    color: #333;
}

/* 10px */
.price-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.tris {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.tri {
    font-size: 6px;
    color: #bbb;
}

/* 6px */
.tri.active {
    color: #27ba9b;
    font-weight: 700;
}

/* ===== Column titles row (your red labels) ===== */
/* remove border-bottom */
.cols-head {
    display: grid;
    grid-template-columns: 65% 35%;
    /* 13:7 split */
    text-align: center;
    /* center each column’s text */
    padding-bottom: 6px;
    border-bottom: 1px solid #f2f2f2;
}

.col-title {
    color: #bbb;
    /* red */
    font-weight: 600;
    font-size: 10px;
}


.col-title.right {
    text-align: right;
    padding-right: 8px;
}

/* ===== Two columns with permanent vertical divider ===== */
.two-col {
    position: relative;
    display: grid;
    grid-template-columns: 65% 35%;
    /* 13:7 */
}

.col {
    min-width: 0;
}

.left {
    padding-right: 8px;
}

/* tiny gap from divider */
.right {
    padding-left: 8px;
}

.vline {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 65%;

    width: 1px;
    background: #e9e9e9;
    /* thin permanent divider */
    transform: translateX(-0.5px);
    pointer-events: none;
}


.list {
    height: calc(100vh - 240px);
}


.empty {
    color: #888;
    text-align: center;
    padding: 12px;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 66px;
    /* fixed height; tweak 64–68 as you like */
    border-bottom: 1px solid #efefef;
    padding: 0 0;
}

.left-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* vertically center the two lines within fixed row */
    min-width: 0;
    /* keep ellipsis working */
}

.line1,
.line2 {
    display: flex;
    align-items: center;
    gap: 8px;
}

.line2 {
    margin-top: 2px;
}

.right-rail {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    /* center within the row height */
    gap: 6px;
    margin-left: 8px;
    flex: 0 0 auto;
}

.chip {
    font-size: 10px;
    background: #f5f5f5;
    padding: 1px 6px;
    border-radius: 999px;
    color: #666;
}

.title {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fee {
    font-weight: 700;
    color: #27ba9b;
    font-size: 14px;
    line-height: 1;
}

.meta,
.date {
    font-size: 12px;
    color: #888;
}

.date {
    margin-left: auto;
}


.btn-ghost {
    background: #27ba9b;
    /* replace with your theme blue if needed: #007BFF */
    color: #fff;
    font-weight: 500;
    font-size: 10px;
    padding: 4px 14px;
    border-radius: 2px;
    border: none;
    line-height: 1.2;
    box-shadow: none;
}


.btn-ghost:active {
    opacity: .7;
}

.btn-reprice {
    background: #27ba9b;
    /* replace with your theme blue if needed: #007BFF */
    color: #fff;
    font-weight: 500;
    font-size: 10px;
    padding: 4px 14px;
    border-radius: 2px;
    border: none;
    line-height: 1.2;
    box-shadow: none;
}

.btn-reprice:active {
    opacity: 0.85;
}


.panel:last-child .title {
    font-size: 11px;
}

.panel:last-child .meta {
    font-size: 9px;
}

.nosb::-webkit-scrollbar {
    width: 0;
    height: 0;
}

.nosb {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
</style>
