<script lang="ts" setup>
import { PropType, toRef, ref } from 'vue'
import { FormKitFrameworkContext } from '@formkit/core';
const props = defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext & { currency: string }>,
    required: true
  }
})
const currency = ref<HTMLSelectElement | null>(null)
const amount = ref<HTMLInputElement | null>(null)
const context = toRef(props, 'context')
const input = () => {
  if (currency.value && amount.value) {
    props.context.node.input({
      currency: currency.value.value,
      amount: amount.value.value
    })
  }
}
</script>

<template>
  <div class="selector-area">
    <select
      ref="currency"
      class="w-48 h-8"
      :class="context.classes.selector"
      :value="context._value.currency"
      @change="input"
    >
      <option value="€" class="text-red-300">
        Euros
      </option>
      <option value="$">
        Dollars
      </option>
      <option value="£">
        Pounds
      </option>
    </select>
  </div>
  <input
    ref="amount"
    :value="context._value.amount"
    v-bind="context.attrs"
    :class="context.classes.input"
    @input="input"
  >
</template>

<style scoped>
.selector-area {
  padding: var(--formkit-input-padding);
  background-color: #e4e4e4;
  height: 100%;
}
.formkit-selector {
  appearance: none;
  border: 0;
  background-color: transparent;
}
.formkit-selector:focus {
  outline: none;
}
</style>