<template>
  <scs-result title="Order Succeed!" content="Your order has been generated. we will notice owner to send good immediately. please pay attention to order's delivery information.">
    <at-flex align="center" class="mt-50">
      <at-flex-item :offset="3" :size="6" class="mr-5">
        <at-button type="primary" @click="onToDetailClicked">View Order</at-button>
      </at-flex-item>
    </at-flex>
    <at-fab style="position: fixed; right: 50rpx; bottom: 50rpx" :onClick="onToHomeClicked">
      <text class='at-fab__icon at-icon at-icon-home'></text>
    </at-fab>
  </scs-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ScsResult from '../../components/ScsResult.vue'
import Taro from '@tarojs/taro'
export default defineComponent({
  name: 'generateOrderSucceed',
  components: {
    ScsResult
  },
  setup () {
    function onToDetailClicked () {
      const queryParams = Taro.getCurrentInstance().router?.params || {}
      Taro.navigateTo({
        url: `../orderDtl/orderDtl?gid=${queryParams.oid}`
      })
    }
    function onToHomeClicked () {
      Taro.switchTab({
        url: '../index/index'
      })
    }
    return {
      onToDetailClicked,
      onToHomeClicked
    }
  }
})
</script>
