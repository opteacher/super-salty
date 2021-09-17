<template>
  <basic-layout>
    <at-search-bar
      :value="value1"
      @change="onChange.bind(this, 'value1')"
      @action-click="onActionClick"
    />
    <at-list class="order-list" :hasBorder="false">
      <at-list-item
        v-for="order in orders"
        :key="order._index"
        :title="order.good.name"
        :note="`${order.good.unit} ${order.price}`"
        :thumb="order.good.cover"
        :extraText="order.status"
        arrow="right"
        @click="onOrderClicked(order._index)"
      />
    </at-list>
  </basic-layout>
</template>

<script lang="ts">
import { getOrdersByUser } from '../../api'
import { Order } from '../../commons'
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import BasicLayout from '../../components/BasicLayout.vue'
import Taro from '@tarojs/taro'
export default defineComponent ({
  name: 'OrderList',
  components: {
    BasicLayout
  },
  onShow () {
    this.init()
  },
  setup() {
    const store = useStore()
    const orders = ref([] as Order[])
    async function init () {
      const lgnUsr = store.getters.loginedUser
      orders.value = await getOrdersByUser(lgnUsr._index)
    }
    function onOrderClicked (oid: string) {
      Taro.navigateTo({ url: `../orderDtl/orderDtl?oid=${oid}` })
    }
    return {
      orders,

      init,
      onOrderClicked
    }
  }
})
</script>

<style lang="scss">
.order-list .item-thumb {
  width: 100rpx;
  height: 100rpx;
}
</style>
