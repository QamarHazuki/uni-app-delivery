import sdSwiper from '@/components/sdSwiper.vue'

import sdGuess from '@/components/sdGuess.vue'

declare module 'vue' {
  export interface GlobalComponents {
    sdSwiper: typeof sdSwiper
    sdGuess: typeof sdGuess
  }
}

// 组件实例类型
export type sdGuessInstance = InstanceType<typeof sdGuess>
export type sdSwiperInstance = InstanceType<typeof sdSwiper>