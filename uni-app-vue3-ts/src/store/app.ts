import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'


type Role = 'customer' | 'courier'
type Address = { label: string; value: string }
export type MyOrder = {
  id: string
  summary?: string
  status: string
  mineAs: 'customer' | 'courier'
  type?: 'food' | 'package' | 'unknown'
}

export const useApp = defineStore('app', () => {
  const user = reactive({
    registered: false,
    role: 'customer' as Role,
    sex: '' as '' | 'male' | 'female',
    phone: '',
    online: false,
    addresses: [] as Address[],
    activeOrdersCount: 0,
  })

  const cart = reactive({
    items: [] as Array<{ restaurantId: string; dishId: string; qty: number }>
  })

  const orders = reactive({
    availablePool: [] as any[],
    myOrders: [] as MyOrder[],
    onlineCouriers: [] as any[],
  })

  // dynamic fees (use env if present; fallback to defaults)
  const fees = reactive({
    food: Number(import.meta.env.VITE_FEE_FOOD ?? 3),
    package: Number(import.meta.env.VITE_FEE_PACKAGE ?? 4),
  })

  const unsettledCustomerCount = computed(() =>
    orders.myOrders.filter(
      o => o.mineAs === 'customer' && !['COMPLETED', 'CANCELED'].includes(o.status)
    ).length
  )

  const canGoOnline = computed(
    () => user.role === 'courier' && user.registered && user.activeOrdersCount === 0
  )

  const canSwitchToCourier = computed(
    () => user.registered && user.activeOrdersCount === 0 && unsettledCustomerCount.value === 0
  )

  return { user, cart, orders, fees, canGoOnline, canSwitchToCourier, unsettledCustomerCount }
})
