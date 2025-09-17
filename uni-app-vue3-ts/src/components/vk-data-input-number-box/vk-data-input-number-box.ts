// props (mark defaulted ones as optional)
export interface InputNumberBoxProps {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  inputWidth?: string | number
  inputHeight?: string | number
  bgColor?: string
  index?: string
}

// event payload
export interface InputNumberBoxEvent {
  value: number
  index?: string
}

// emits typing to use inside .vue (optional but nice)
export type InputNumberBoxEmits = {
  (e: 'update:modelValue', v: number): void
  (e: 'change', p: InputNumberBoxEvent): void
  (e: 'blur',   p: InputNumberBoxEvent): void
  (e: 'plus',   p: InputNumberBoxEvent): void
  (e: 'minus',  p: InputNumberBoxEvent): void
}

// Global component type (for template auto-complete)
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VkDataInputNumberBox: typeof import('@/components/vk-data-input-number-box/vk-data-input-number-box.vue')['default']
  }
}
export {}
