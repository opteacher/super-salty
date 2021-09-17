<template>
  <at-input
    clear
    :focus="formState.focusComp.value === field"
    :error="formState.errMsgs[field] !== ''"
    :name="field"
    :type="ftype"
    :placeholder="`input ${field}`"
    :value="formState.form[field]"
    @change="val => { formState.form[field] = formState.onFieldChanged(field, val) }"
  ><slot/></at-input>
  <view v-if="formState.errMsgs[field] !== ''" class="at-article__info err-msg">
    {{formState.errMsgs[field]}}
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ValidInput',
  props: {
    field: { type: String, required: true },
    formState: { type: Object, required: true },
    ftype: { type: String, default: 'text' },
  },
  setup (props) {
    return {
      ...props,
    }
  },
})
</script>
