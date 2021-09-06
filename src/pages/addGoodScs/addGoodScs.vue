<template>
  <scs-result title="Add Good Succeed!" content="Your good now display in the home page.">
    <at-flex>
      <at-flex-item :size="6" class="mr-5">
        <at-button type="primary" @click="onToDetailClicked">View Detail</at-button>
      </at-flex-item>
      <at-flex-item :size="6" class="ml-5">
        <at-button @click="onAddAgainClicked">Add Again</at-button>
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
  name: 'addGoodSucceed',
  components: {
    ScsResult
  },
  setup () {
    function onToDetailClicked () {
      const queryParams = Taro.getCurrentInstance().router?.params || {}
      Taro.navigateTo({
        url: `../../pages/goodDtl/goodDtl?gid=${queryParams.gid}`
      })
    }
    function onAddAgainClicked () {
      Taro.navigateTo({
        url: '../../pages/addGood/addGood'
      })
    }
    function onToHomeClicked () {
      Taro.switchTab({
        url: '../../pages/index/index'
      })
    }
    return {
      onToDetailClicked,
      onAddAgainClicked,
      onToHomeClicked
    }
  }
})
</script>
