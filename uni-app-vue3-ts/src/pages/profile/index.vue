<script setup lang="ts">
import { ref } from 'vue'
import { useApp } from '@/store/app'
import { computed } from 'vue'
import customTopbar from '@/components/customTopbar.vue'
import CustomTabbar from '@/components/CustomTabbar.vue'

const myCount = computed(() => app.orders.myOrders.length)
const last3 = computed(() => app.orders.myOrders.slice(-3).reverse())
function openMyOrders() { uni.navigateTo({ url: '/pages/orders/index' }) }



const app = useApp()

// --- Registration ---
const regSex = ref<'' | 'male' | 'female'>('')   // ← no default
function onSexChange(e: any) { regSex.value = e.detail.value }
const regPhone = ref('')

function doRegister() {
  if (!regSex.value) return uni.showToast({ title: '请选择性别', icon: 'none' })
  if (!/^1[3-9]\d{9}$/.test(regPhone.value)) return uni.showToast({ title: '请输入有效手机号', icon: 'none' })

  app.user.sex = regSex.value
  app.user.phone = regPhone.value
  app.user.registered = true
  uni.showToast({ title: 'Registered', icon: 'none' })
}


// --- Addresses ---
const addr = ref('')
function addAddr() {
  if (!app.user.registered) return uni.showToast({ title: '请先注册', icon: 'none' })
  const v = addr.value.trim()
  if (!v) return uni.showToast({ title: '请填写地址（精确到房间号）', icon: 'none' })
  app.user.addresses.push({ label: v, value: v })
  addr.value = ''
}


// --- Role switch (navigate to role home) ---
function toggleRole() {
  if (app.user.role === 'customer') {
    if (!app.user.registered) return uni.showToast({ title: 'Register first', icon: 'none' })
    if (!app.canSwitchToCourier) {
      const n = app.unsettledCustomerCount
      const msg = n > 0 ? `你有 ${n} 个未完成的用户订单` : 'Finish active orders'
      return uni.showToast({ title: msg, icon: 'none' })
    }
    app.user.role = 'courier'
    app.user.online = false
    uni.reLaunch({ url: '/pages/dispatch/index' })
    uni.showToast({ title: 'Switched to Courier', icon: 'none' })
  } else {
    if (app.user.activeOrdersCount > 0) return uni.showToast({ title: 'Finish active orders', icon: 'none' })
    app.user.role = 'customer'
    app.user.online = false
    uni.reLaunch({ url: '/pages/food/index' })
    uni.showToast({ title: 'Switched to Customer', icon: 'none' })
  }
}

// --- Online toggle (courier only) ---
function toggleOnline() {
  if (!app.canGoOnline) return uni.showToast({ title: 'Cannot go online now', icon: 'none' })
  app.user.online = !app.user.online
}
</script>

<template>
  <customTopbar />
  <view style="padding:12px">
    <view style="font-weight:600">Account</view>

    <!-- Register (sex REQUIRED) -->
    <view v-if="!app.user.registered" style="margin:8px 0;">
      <radio-group @change="onSexChange">
        <label style="margin-right:16px;">
          <radio value="male" :checked="regSex === 'male'" /> 男
        </label>
        <label>
          <radio value="female" :checked="regSex === 'female'" /> 女
        </label>
      </radio-group>
      <input v-model="regPhone" placeholder="手机号" type="number" />
      <button style="margin-top:8px" @tap="doRegister">Register (mock)</button>
    </view>

    <!-- Only show after registered -->
    <view v-else style="margin:8px 0">
      <text>
        Role: {{ app.user.role === 'customer' ? 'Customer (点餐/代取)' : 'Courier (配送)' }}
        · Sex: {{ app.user.sex === 'male' ? '男' : '女' }}
      </text>
    </view>

    <button @tap="toggleRole">Switch Role</button>

    <view v-if="app.user.role === 'courier'">
      <view>Online: {{ app.user.online ? 'Yes' : 'No' }}</view>
      <button :disabled="!app.canGoOnline" @tap="toggleOnline">Toggle Online</button>
      <view v-if="!app.canGoOnline" style="color:#888">Need: registered & 0 active orders</view>
    </view>

    <!-- Addresses (customer only) -->
    <view v-if="app.user.role === 'customer'" style="margin-top:16px;font-weight:600">地址</view>
    <view v-if="app.user.role === 'customer'">
      <view v-for="a in app.user.addresses" :key="a.value">{{ a.label }}</view>
      <input v-model="addr" placeholder="设施或宿舍房间号（如 11号楼-214）" :disabled="!app.user.registered" />
      <button @tap="addAddr" :disabled="!app.user.registered">Add</button>
    </view>


    <view style="margin-top:16px;font-weight:600;display:flex;align-items:center;gap:8px">
      <text>我的订单</text>
      <text style="font-size:12px;color:#888">({{ myCount }} total)</text>
    </view>
    <button @tap="openMyOrders">Open My Orders</button>

    <!-- tiny preview (last 3) -->
    <view v-if="last3.length" style="margin-top:8px">
      <view v-for="o in last3" :key="o.id"
        style="display:flex;gap:8px;align-items:center;border:1px solid #eee;border-radius:10px;padding:8px;margin-bottom:6px">
        <text style="flex:1">{{ o.summary || o.id }}</text>
        <text style="font-size:12px;color:#27ba9b">{{ o.status }}</text>
      </view>
    </view>


    <!-- Dev helper -->
    <button type="warn" style="margin-top:12px" @tap="app.user.activeOrdersCount = 0">
      Dev: Clear active orders
    </button>
  </view>

  <CustomTabbar />
</template>
