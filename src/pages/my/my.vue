<template>
  <basic-layout class="container p-0" style="background-color: #EEF0F0">
    <view class="center-container avatar-container">
      <view class="text-center">
        <at-avatar circle :image="account.avatar"/>
        <view class="at-article__p lighter-ft-color">{{account.intro}}</view>
      </view>
    </view>
    <at-card
      class="order-card mt-10"
      title="Order"
      extra="more"
      :icon="{ value: 'shopping-bag-2', color: '#6190E8' }"
      is-full
      @click="onOrderClicked"
    >
      <at-grid :columnNum="3" :data="orders" @click="onOrderClicked"/>
    </at-card>
    <at-card
      class="mt-10 bb-0"
      title="Published goods"
      :icon="{ value: 'list', color: '#6190E8' }"
      is-full
    >
      <view v-if="!pubGoods.length" class="h-100 center-container">
        <view class="text-center">
          <at-icon value="folder" size="60" color="#6190E899"/>
          <view style="color: #6190E899">No Goods</view>
        </view>
      </view>
      <view v-else>
        <at-flex v-for="(gdPair, idx) in pubGoods" :key="idx" justify="around"
          :class="idx !== pubGoods.length - 1 ? 'mb-20' : ''"
        >
          <at-flex-item :size="6" style="padding-right: 12rpx">
            <good-card :good="gdPair[0]"/>
          </at-flex-item>
          <at-flex-item :size="6" style="padding-left: 12rpx">
            <good-card v-if="gdPair[1]" :good="gdPair[1]"/>
          </at-flex-item>
        </at-flex>
      </view>
    </at-card>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getGoodsByOwner } from '../../api'
import GoodCard from '../../components/GoodCard.vue'
import BasicLayout from '../../components/BasicLayout.vue'
import { useStore } from 'vuex'
import { Good } from 'src/commons'
import Taro from '@tarojs/taro'

export default defineComponent({
  name: 'my',
  components: {
    GoodCard,
    BasicLayout
  },
  onShow () {
    this.refresh()
  },
  setup () {
    const store = useStore()
    const account = ref(store.getters.loginedUser)
    const pubGoods = ref([] as Good[][])
    const orders = [{
      iconInfo: {
        size: 40,
        value: 'folder'
      },
      value: 'Pay'
    }, {
      iconInfo: {
        size: 40,
        value: 'folder'
      },
      value: 'Deliver'
    }, {
      iconInfo: {
        size: 40,
        value: 'folder'
      },
      value: 'Receive'
    }, {
      iconInfo: {
        size: 40,
        value: 'folder'
      },
      value: 'Comment'
    }, {
      iconInfo: {
        size: 40,
        value: 'folder'
      },
      value: 'Refund'
    }]

    async function refresh () {
      let goods = await getGoodsByOwner(account.value._index)
      pubGoods.value = []
      for (let i = 0; i < goods.length; i += 2) {
        const item = [goods[i]]
        if (i !== goods.length - 1) {
          item.push(goods[i + 1])
        }
        pubGoods.value.push(item)
      }
    }
    function onOrderClicked (item: any, index: number) {
      if (!index && item.mpEvent && item.mpEvent.target) {
        const ele = document.getElementById(item.mpEvent.target.id)
        if (ele?.textContent === 'more') {
          Taro.navigateTo({ url: '../orderList/orderList' })
        }
      } else {
        console.log(item, index)
      }
    }
    return {
      account,
      orders,
      pubGoods,

      refresh,
      onOrderClicked
    }
  }
})
</script>

<style lang="scss">
.order-card .at-card__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.avatar-container {
  height: 40vh;
  background-color: #c2abc7;

  .at-avatar {
    width: 30vw;
    height: 30vw;
    margin: 0 auto;
  }
}
</style>
