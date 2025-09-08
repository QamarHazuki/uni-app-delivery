// src/service/orderFlow.ts
import type { MyOrder } from '@/store/app'

export type OrderType = 'food' | 'package' | 'unknown'
export type Status =
  | 'CREATED'     // customer just created (local)
  | 'POSTED'      // visible in availablePool
  | 'ASSIGNED'    // taken by a courier
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELED'

export type PoolOrder = {
  id: string
  type: OrderType
  pickup?: string
  pickupCode?: string 
  drop?: string
  fee?: number
  status: Status
  customerSex?: 'male' | 'female'
  customerPhone?: string
  payOnDelivery?: boolean
  codAmount?: number
}

export function postToPool(app: any, o: PoolOrder) {
  upsert(app.orders.availablePool, o)
}

export function createCustomerView(o: PoolOrder): MyOrder {
  return {
    id: o.id,
    summary: o.pickup && o.drop ? `${o.pickup} → ${o.drop}` : o.id,
    status: 'CREATED',
    mineAs: 'customer',
    type: o.type ?? 'unknown',
  }
}

export function createCourierView(o: PoolOrder): MyOrder {
  return {
    id: o.id,
    summary: o.pickup && o.drop ? `${o.pickup} → ${o.drop}` : o.id,
    status: 'ASSIGNED',
    mineAs: 'courier',
    type: o.type ?? 'unknown',
  }
}

/* Courier taps “Accept” on a POSTED order */
export function acceptOrder(app: any, id: string) {
  const i = app.orders.availablePool.findIndex((x: PoolOrder) => x.id === id)
  if (i === -1) return false
  const o = app.orders.availablePool[i]
  if (o.status !== 'POSTED') return false

  app.orders.availablePool[i] = { ...o, status: 'ASSIGNED' } as PoolOrder
  app.orders.myOrders.push(createCourierView(app.orders.availablePool[i]))
  app.user.activeOrdersCount++
  return true
}

export function markPicked(app: any, id: string) {
  bump(app, id, 'PICKED_UP')
}
export function markDelivered(app: any, id: string) {
  bump(app, id, 'DELIVERED')
}
export function markCompleted(app: any, id: string) {
  bump(app, id, 'COMPLETED')
  if (app.user.role === 'courier' && app.user.activeOrdersCount > 0) app.user.activeOrdersCount--
}

export function cancelByCustomer(app: any, id: string) {
  // in myOrders (customer view) allow cancel only when CREATED/POSTED
  const i = app.orders.myOrders.findIndex((o: MyOrder) => o.id === id && o.mineAs === 'customer')
  if (i === -1) return false
  const o = app.orders.myOrders[i]
  if (o.status !== 'CREATED' && o.status !== 'POSTED') return false

  app.orders.myOrders[i] = { ...o, status: 'CANCELED' }

  // also remove from pool if still POSTED
  const j = app.orders.availablePool.findIndex((p: PoolOrder) => p.id === id)
  if (j > -1 && app.orders.availablePool[j].status === 'POSTED') {
    app.orders.availablePool.splice(j, 1)
  }
  return true
}

/* ---------------- internal helpers ---------------- */

function upsert(list: PoolOrder[], item: PoolOrder) {
  const i = list.findIndex(x => x.id === item.id)
  if (i === -1) list.push(item)
  else list[i] = { ...list[i], ...item }
}

function bump(app: any, id: string, to: Status) {
  const i = app.orders.myOrders.findIndex((o: MyOrder) => o.id === id)
  if (i > -1) app.orders.myOrders[i] = { ...app.orders.myOrders[i], status: to }
}

export function updateFee(app: any, id: string, fee: number) {
  // only allow while POSTED and if this user owns the order (created it)
  const j = app.orders.availablePool.findIndex((p: PoolOrder) => p.id === id)
  if (j === -1) return false
  const pool = app.orders.availablePool[j]
  if (pool.status !== 'POSTED') return false

  const mine = app.orders.myOrders.some(
    (o: MyOrder) => o.id === id && o.mineAs === 'customer' && (o.status === 'CREATED' || o.status === 'POSTED')
  )
  if (!mine) return false

  app.orders.availablePool[j] = { ...pool, fee: Math.max(0, Number(fee) || 0) }
  return true
}