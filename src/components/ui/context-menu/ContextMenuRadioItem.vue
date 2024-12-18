<script setup lang="ts">
import { cn } from '@/lib/utils'
import { DotFilledIcon } from '@radix-icons/vue'
import {
  ContextMenuItemIndicator,
  ContextMenuRadioItem,
  type ContextMenuRadioItemEmits,
  type ContextMenuRadioItemProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<ContextMenuRadioItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ContextMenuRadioItemEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ContextMenuRadioItem
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-stone-100 focus:text-stone-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-stone-800 dark:focus:text-stone-50',
      props.class,
    )"
  >
    <span class="absolute left-2 h-3.5 w-3.5 flex items-center justify-center">
      <ContextMenuItemIndicator>
        <DotFilledIcon class="h-4 w-4 fill-current" />
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuRadioItem>
</template>
