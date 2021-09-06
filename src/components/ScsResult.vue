<template>
  <view style="position: fixed; top: 0; bottom: 0; left: 0; right: 0">
    <view class="center-container" style="height: 90vh">
      <view class="text-center">
        <at-icon value="check-circle" size="100" color="#13CE66"/>
        <view class="result-title at-article__h1">{{title}}</view>
        <view class="result-content at-article__p">{{content}}</view>
        <view class="mt-20"><slot/></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'successResult',
  props: {
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  setup (props) {
    return {
      ...props,
    }
  }
})
</script>
