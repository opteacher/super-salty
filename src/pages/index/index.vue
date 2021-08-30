<template>
  <basic-layout class="container">
    <at-search-bar
      :fixed="true"
      @change="onSchChanged"
      @action-click="onSchSubmit"
    />
    <view class="scroll-container pt-0 pb-0" style="top: 40px">
      <good-item
        v-for="(good, index) in goods" :key="index"
        :good="good"
        :btm-border="index !== goods.length - 1"
      />
    </view>
    <view class="float-button">
      <at-fab size="small" @click="onAddGoodClicked">
        <text class="at-fab__icon at-icon at-icon-add"></text>
      </at-fab>
    </view>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GoodItem from '../../components/GoodItem.vue'
import BasicLayout from '../../components/BasicLayout'
import { getAllGoods } from '../../api/good'
import Taro from '@tarojs/taro'

interface Good {
  name: string
  price: [number, string]
  logo: string,
  location: string,
  tags: string[]
}

export default defineComponent({
  name: 'home',
  components: {
    GoodItem,
    BasicLayout
  },
  setup () {
    const schWds = ref('')
    const goods: Array<Good> = ref(getAllGoods())
    const onSchChanged = (search) => {
      schWds.value = search
      console.log(schWds)
    }
    const onSchSubmit = () => {
      console.log(schWds)
    }
    const onAddGoodClicked = () => {
      Taro.navigateTo({
        url: '../../pages/addGood/addGood'
      })
    }
    return {
      schWds,
      goods,
      onSchChanged,
      onSchSubmit,
      onAddGoodClicked
    }
  }
})
</script>

<style lang="scss">
.float-button {
  position: fixed;
  right: 32rpx;
  bottom: 32rpx;
  z-index: 1100;
}
</style>
