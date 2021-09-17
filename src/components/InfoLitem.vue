<template>
  <at-flex class="pt-10 pb-10" align="center">
    <at-flex-item :size="3">
      <text class="at-article__h3 mt-0">{{title}}</text>
    </at-flex-item>
    <at-flex-item :size="9" is-auto class="text-right">
      <view class="at-article__p mt-0">
        <text v-if="value">{{value}}</text>
        <slot v-else/>
      </view>
    </at-flex-item>
  </at-flex>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'InfoListItem',
  props: {
    title: { type: String, required: true },
    value: { type: String, default: '' }
  },
  setup (props) {
    return {
      ...props,
    }
  }
})
</script>
