<script setup lang="ts">
import { computed } from 'vue'
import { useApp } from '@/store/app'
const app = useApp()

const customerTabs = [{ path: '/pages/profile/temp', text: 'my_temp', icon: '/static/tabs/category_default.png', iconActive: '/static/tabs/category_selected.png' },
{ path: '/pages/login/login', text: 'login', icon: '/static/tabs/category_default.png', iconActive: '/static/tabs/category_selected.png' },
{ path: '/pages/category/category', text: '分类', icon: '/static/tabs/category_default.png', iconActive: '/static/tabs/category_selected.png' },
{ path: '/pages/food/index', text: '点餐', icon: '/static/tabs/restaurant_default.png', iconActive: '/static/tabs/restaurant_selected.png' },
{ path: '/pages/package/create', text: '代取快递', icon: '/static/tabs/package_default.png', iconActive: '/static/tabs/package_selected.png' },
{ path: '/pages/chat/index', text: '聊天', icon: '/static/tabs/chat_default.png', iconActive: '/static/tabs/chat_selected.png' },
{ path: '/pages/dispatch/index', text: '订单配送', icon: '/static/tabs/dispatch_default.png', iconActive: '/static/tabs/dispatch_selected.png' },
{ path: '/pages/profile/index', text: '我的', icon: '/static/tabs/user_default.png', iconActive: '/static/tabs/user_selected.png' }
]
const courierTabs = [
    { path: '/pages/chat/index', text: '聊天', icon: '/static/tabs/chat_default.png', iconActive: '/static/tabs/chat_selected.png' },
    { path: '/pages/dispatch/index', text: '订单配送', icon: '/static/tabs/dispatch_default.png', iconActive: '/static/tabs/dispatch_selected.png' },
    { path: '/pages/profile/index', text: '我的', icon: '/static/tabs/user_default.png', iconActive: '/static/tabs/user_selected.png' }
]

const tabs = computed(() => app.user.role === 'courier' ? courierTabs : customerTabs)

function curPath() {
    const pages = getCurrentPages()
    const last = pages[pages.length - 1]
    return '/' + (last?.route || (last as any)?.$page?.fullPath || '')
}
function go(p: string) { if (curPath() !== p) uni.reLaunch({ url: p }) }

// bottom safe-area from uni
const safeB = (uni.getSystemInfoSync().safeAreaInsets?.bottom ?? 0)
</script>

<template>
    <!-- expose --safe-b so siblings can use it too -->
    <view class="custom-tabbar" :style="{ '--safe-b': safeB + 'px' }">
        <view v-for="t in tabs" :key="t.path" class="item" @tap="go(t.path)">
            <image :src="curPath() === t.path ? t.iconActive : t.icon" class="icon" />
            <text :class="['txt', curPath() === t.path ? 'active' : '']">{{ t.text }}</text>
        </view>
    </view>
</template>

<style scoped>
.custom-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(56px + var(--safe-b, 0px));
    padding-bottom: var(--safe-b, 0px);
    display: flex;
    background: #fff;
    border-top: 1px solid #eee;
    z-index: 999;
}

@supports (padding-bottom: constant(safe-area-inset-bottom)) {
    .custom-tabbar {
        height: calc(56px + constant(safe-area-inset-bottom));
        padding-bottom: constant(safe-area-inset-bottom);
    }
}

.item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.icon {
    width: 24px;
    height: 24px;
}

.txt {
    font-size: 12px;
    color: #333;
}

.active {
    color: #27ba9b;
}
</style>
