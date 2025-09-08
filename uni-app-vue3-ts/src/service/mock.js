// service/mock.js
const delay = (ms) => new Promise(r => setTimeout(r, ms))

// --- Restaurants (UI demo) ---
export async function listRestaurants() {
  await delay(80)
  return [
    { id: 'r1', name: 'Canteen A', dishes: [{ id: 'd1', name: 'Rice', price: 12 }] },
    { id: 'r2', name: 'Canteen B', dishes: [{ id: 'd2', name: 'Noodles', price: 10 }] }
  ]
}

// --- Dispatch pool (sex-segregated demo data) ---
// customers will only see couriers with same sex; couriers only see orders with same customerSex
export async function listDispatchPool() {
  await delay(80)
  return {
    orders: [
      { id: 'o1', type: 'food', pickup: 'Canteen A', drop: 'B-214', fee: 3, status: 'POSTED', customerSex: 'male' },
      { id: 'o2', type: 'package', pickup: 'Locker-3', drop: 'C-503', fee: 4, status: 'POSTED', customerSex: 'female' }
    ],
    couriers: [
      { id: 'c1', name: 'Stu Zhang', rating: 4.9, online: true, sex: 'male' },
      { id: 'c2', name: 'Stu Li', rating: 4.7, online: true, sex: 'female' }
    ]
  }
}

// --- My orders (starter empty) ---
export async function listMyOrders(role = 'customer') {
  await delay(50)
  return [] // keep empty by default for UI; you can push into store on submit/accept
}

// --- Create orders (UI-only stubs) ---
const newId = (p) => `${p}_${Date.now()}_${Math.floor(Math.random() * 1e4)}`

/** Create a food order from cart (UI-only) */
export async function submitCartAsOrder({ summary, fee = 3, customerSex }) {
  await delay(60)
  return {
    id: newId('food'),
    type: 'food',
    pickup: 'Canteen (cart)',
    drop: summary,     // keep simple for mock
    fee,
    status: 'POSTED',
    customerSex        // 'male' | 'female'
  }
}

/** Create a package order (optional helper if you prefer calling a mock) */
export async function createPackageOrder({ pickup, pickupCode, drop, fee = 4, customerSex }) {
  await delay(60)
  return {
    id: newId('pkg'),
    type: 'package',
    pickup,
    pickupCode,
    drop,
    fee,
    status: 'POSTED',
    customerSex
  }
}
