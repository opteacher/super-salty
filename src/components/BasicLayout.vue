<template>
  <view>
    <at-modal :isOpened="loading" :closeOnClickOverlay="false">
      <at-modal-content style="height: 100rpx">
        <at-activity-indicator class="float-loading" mode="center" :size="64" content="loading..."/>
      </at-modal-content>
    </at-modal>
    <at-message :duration="10000"/>
    <at-modal
      class="confirm-dialog"
      :isOpened="confirming"
      title="Are you sure?"
      :content="cfmContent"
      cancelText="No"
      confirmText="Yes"
      @cancel="onCfmCanceled"
      @confirm="onCfmClicked"
      :closeOnClickOverlay="false"
    />
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
    const confirming = computed(() => store.getters.isConfirming)
    const cfmContent = computed(() => store.getters.confirmContent)

    const onCfmClicked = computed(() => store.getters.confirmCallback)
    function onCfmCanceled () {
      store.dispatch('hideConfirm')
    }
    return {
      loading,
      confirming,
      cfmContent,

      onCfmClicked,
      onCfmCanceled
    }
  }
})
</script>

<style lang="scss">
.float-loading .at-activity-indicator__content {
  font-size: 15pt;
}

.confirm-dialog .at-modal__content {
  min-height: 80rpx !important;
  text-align: center;
}
</style>

