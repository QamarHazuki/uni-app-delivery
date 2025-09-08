<script setup lang="ts">
import { useApp, type MyOrder } from '@/store/app'
import CustomTabbar from '@/components/CustomTabbar.vue'
import {
    markPicked as flowPicked,
    markDelivered as flowDelivered,
    markCompleted as flowCompleted,
    cancelByCustomer
} from '@/service/orderFlow'
const app = useApp()

const label = (o: MyOrder) => o.summary ?? (o.type ? `${o.type} ${o.id}` : o.id)

const markPicked = (id: string) => flowPicked(app, id)
const markDelivered = (id: string) => flowDelivered(app, id)
const markCompleted = (id: string) => flowCompleted(app, id)
function cancelOrder(id: string) {
    if (app.user.role === 'courier') return
    if (!cancelByCustomer(app, id)) {
        uni.showToast({ title: '已被接单，无法取消', icon: 'none' })
    }
}
</script>

<template>
    <view>
        <view style="font-weight:600;margin-bottom:8px">
            我的订单 · {{ app.user.role === 'courier' ? '骑手' : '用户' }}
        </view>

        <view v-if="!app.orders.myOrders.length" style="color:#888">暂无订单</view>

        <view v-for="o in app.orders.myOrders" :key="o.id"
            style="display:flex;align-items:center;gap:8px;border:1px solid #eee;border-radius:12px;padding:10px;margin-bottom:8px">
            <view style="flex:1">{{ label(o) }}</view>
            <view style="font-size:12px;background:#eee;padding:2px 8px;border-radius:999px">{{ o.status }}</view>

            <!-- Courier actions -->
            <view v-if="app.user.role === 'courier'" style="display:flex;gap:6px;margin-left:8px">
                <button size="mini" v-if="o.status === 'ASSIGNED'" @tap="markPicked(o.id)">Picked</button>
                <button size="mini" v-if="o.status === 'PICKED_UP'" @tap="markDelivered(o.id)">Delivered</button>
                <button size="mini" v-if="o.status === 'DELIVERED'" @tap="markCompleted(o.id)">Complete</button>
                <button size="mini" v-if="o.status === 'ASSIGNED'" @tap="cancelOrder(o.id)">Cancel</button>
            </view>

            <!-- Customer actions -->
            <view v-else style="display:flex;gap:6px;margin-left:8px">
                <button size="mini" v-if="o.status === 'CREATED' || o.status === 'POSTED'"
                    @tap="cancelOrder(o.id)">Cancel</button>
            </view>

        </view>

        <CustomTabbar />
    </view>
</template>
