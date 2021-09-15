<template>
  <basic-layout>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Taro from '@tarojs/taro'
import BasicLayout from '../../components/BasicLayout.vue'
import { newOrder } from '../../commons'
import { getOrder } from '../../api'

export default defineComponent({
  name: 'OrderDetail',
  components: {
    BasicLayout
  },
  onShow () {
    this.init()
  },
  setup () {
    const params = Taro.getCurrentInstance().router?.params
    if (!params?.oid) {
      Taro.navigateBack({ delta: 1 })
    }
    const order = ref(newOrder())

    async function init () {
      order.value = await getOrder(params?.oid as string)
      console.log(order)
    }
    return {
      order,

      init
    }
  }
})
</script>
