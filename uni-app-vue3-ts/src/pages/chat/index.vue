<script setup lang="ts">
import { ref } from 'vue'
import CustomTabbar from '@/components/CustomTabbar.vue'
import customTopbar from '@/components/customTopbar.vue'

const msgs = ref([
    { id: 1, who: 'me', text: 'Hello!' },
    { id: 2, who: 'them', text: 'Hi, I got your order.' }
])
const text = ref('')
function send() {
    const t = text.value.trim()
    if (!t) return
    msgs.value.push({ id: Date.now(), who: 'me', text: t })
    text.value = ''
    setTimeout(() => msgs.value.push({ id: Date.now() + 1, who: 'them', text: '(mock reply)' }), 400)
}

/* ✅ compute once in JS */
const safeB = uni.getSystemInfoSync().safeAreaInsets?.bottom ?? 0
const TAB_H = 56        // CustomTabbar height
const BAR_H = 52        // composer height
</script>

<template>
    <customTopbar />
    <!-- expose CSS vars -->
    <view class="page" :style="{
        '--safe-b': safeB + 'px',
        '--tab-h': TAB_H + 'px',
        '--bar-h': BAR_H + 'px'
    }">
        <scroll-view scroll-y class="list">
            <view v-for="m in msgs" :key="m.id" :class="['bubble', m.who === 'me' ? 'me' : 'them']">{{ m.text }}</view>
        </scroll-view>

        <!-- composer sits above the tabbar -->
        <view class="composer">
            <input v-model="text" placeholder="Type message..." />
            <button size="mini" @tap="send">Send</button>
        </view>

        <CustomTabbar />
    </view>
</template>

<style scoped>
.page {
    height: 100vh;
}

/* viewport - composer - tabbar - safe-bottom */
.list {
    height: calc(100vh - var(--bar-h) - var(--tab-h) - var(--safe-b));
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* fixed composer ABOVE tabbar + home indicator */
.composer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(var(--tab-h) + var(--safe-b));
    height: var(--bar-h);
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    background: #fff;
    border-top: 1px solid #eee;
    z-index: 998;
}

.bubble {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 12px;
}

.me {
    align-self: flex-end;
    background: #daf;
}

.them {
    align-self: flex-start;
    background: #eee;
}
</style>
