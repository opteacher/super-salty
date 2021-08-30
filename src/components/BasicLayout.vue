<template>
  <view>
    <at-modal :isOpened="loading" :closeOnClickOverlay="false">
      <at-modal-content style="height: 100rpx">
        <at-activity-indicator class="float-loading" mode="center" :size="64" content="loading..."/>
      </at-modal-content>
    </at-modal>
    <at-message :duration="10000"/>
    <slot/>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const loading = computed(() => store.getters.isLoading)
    return {
      loading
    }
  }
})
</script>

<style lang="scss">
.float-loading .at-activity-indicator__content {
  font-size: 15pt;
}
</style>

