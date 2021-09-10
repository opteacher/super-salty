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
        :btm-border="index !== goods.length - 1"
        :good="good"
      />
      <view v-if="!goods.length" class="h-100 center-container">
        <view class="text-center">
          <at-icon value="folder" size="60" color="#6190E899"/>
          <view style="color: #6190E899">No Goods</view>
        </view>
      </view>
    </view>
    <view class="float-button">
      <at-fab size="small" @click="onAddGoodClicked">
        <text class="at-fab__icon at-icon at-icon-add"></text>
      </at-fab>
    </view>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import GoodItem from '../../components/GoodItem.vue'
import Taro from '@tarojs/taro'
import BasicLayout from '../../components/BasicLayout.vue'
import { Good } from '../../commons'
import { getAllGoods } from '../../api'

export default defineComponent({
  name: 'home',
  components: {
    GoodItem,
    BasicLayout
  },
  onShow () {
    this.refresh ()
  },
  setup () {
    const schWds = ref('')
    const goods: Ref<Array<Good>> = ref([])

    async function refresh () {
      goods.value = await getAllGoods()
    }
    function onSchChanged (search) {
      schWds.value = search
      console.log(schWds)
    }
    function onSchSubmit () {
      console.log(schWds)
    }
    function onAddGoodClicked () {
      Taro.navigateTo({
        url: '../../pages/addGood/addGood'
      })
    }
    return {
      schWds,
      goods,

      refresh,
      onSchChanged,
      onSchSubmit,
      onAddGoodClicked
    }
  }
})
</script>
