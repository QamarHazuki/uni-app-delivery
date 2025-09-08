<script setup lang="ts">
import { ref } from 'vue'
import { useApp } from '@/store/app'
import CustomTabbar from '@/components/CustomTabbar.vue'
import customTopbar from '@/components/customTopbar.vue'
import type { PoolOrder } from '@/service/orderFlow'
import { postToPool, createCustomerView } from '@/service/orderFlow'

const app = useApp()

const pickupStation = ref('')
const pickupCode = ref('')
const selectedAddr = ref('')     // NEW

const needPay = ref(true)      // 平台费 (之前已有)
const payOnDelivery = ref(false)
const codAmount = ref('')      // 输入金额

function submit() {
    if (!app.user.registered) return uni.showToast({ title: '请先注册', icon: 'none' })
    if (!app.user.sex) return uni.showToast({ title: '请选择性别', icon: 'none' })
    if (!pickupStation.value || !pickupCode.value)
        return uni.showToast({ title: 'Pickup station & code required', icon: 'none' })
    if (!selectedAddr.value)
        return uni.showToast({ title: '请选择送达地址', icon: 'none' })

    if (payOnDelivery.value && !codAmount.value) {
        return uni.showToast({ title: '请输入到付金额', icon: 'none' })
    }

    const o: PoolOrder = {
        id: 'pkg_' + Date.now(),
        type: 'package',                         // literal, not string
        pickup: pickupStation.value,
        pickupCode: pickupCode.value,
        drop: selectedAddr.value,
        fee: needPay.value ? app.fees.package : 0,
        status: 'POSTED',
        customerSex: (app.user.sex || undefined) as 'male' | 'female' | undefined,
        customerPhone: app.user.phone,
        payOnDelivery: payOnDelivery.value,
        codAmount: payOnDelivery.value ? Number(codAmount.value) : 0
    }
    app.orders.myOrders.push(createCustomerView(o))
    postToPool(app, o)
    pickupStation.value = ''
    pickupCode.value = ''
    selectedAddr.value = ''
    needPay.value = true
    payOnDelivery.value = false
    codAmount.value = ''
    uni.showToast({ title: 'Submitted (mock)', icon: 'success' })
}


</script>

<template>
    <view class="page">
        <customTopbar />
        <view class="card">
            <view class="title">Create Package Order</view>
            <input v-model="pickupStation" placeholder="服务站" :disabled="!app.user.registered" />
            <input v-model="pickupCode" placeholder="取件码" :disabled="!app.user.registered" />

            <!-- 到付选项 -->
            <label style="margin-top:8px;display:flex;align-items:center;gap:6px">
                <switch :checked="payOnDelivery" @change="(e: any) => payOnDelivery = e.detail.value" />
                <text>是否到付</text>
            </label>
            <input v-if="payOnDelivery" v-model="codAmount" placeholder="到付金额 (¥)" type="number" />

            <!-- Address picker (required) -->
            <picker mode="selector" :range="app.user.addresses" range-key="label"
                @change="(e: any) => { const i = Number(e.detail.value); selectedAddr = app.user.addresses[i]?.value || '' }">
                <view style="padding:8px;border:1px solid #eee;border-radius:8px;">
                    {{ selectedAddr || '请选择送达地址' }}
                </view>
            </picker>

            <button type="primary" :disabled="!app.user.registered" @tap="submit">提交</button>
            <view v-if="!app.user.registered" style="color:#888;margin-top:6px">请先在“我的”完成注册并选择性别</view>
        </view>


        <CustomTabbar />
    </view>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px
}

.title {
    font-weight: 600;
    margin-bottom: 6px
}
</style>
