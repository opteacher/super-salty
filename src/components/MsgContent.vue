<template>
  <image
    v-if="msgIsImage(content)"
    class="w-100"
    :src="content"
    mode="widthFit"
  />
  <view
    v-else-if="msgIsOfPice(content)"
    class="w-100"
  >
    <at-list-item
      class="offer-price p-0"
      :note="good.tags.join(' & ')"
      :title="good.name"
      :extraText="`${ofPrice.price} ${good.unit}`"
      :thumb="good.cover"
    />
    <template v-if="good.owner">
      <at-divider :height="50" lineColor="#A8C6DF"/>
      <at-flex>
        <at-flex-item :size="5" v-if="lgnUsr._index !== senderId">
          <at-button
            :disabled="ofPrice.ordered"
            type="primary"
            :active="true"
            size="small"
            @click="onOrderSubmit"
          >Accept</at-button>
        </at-flex-item>
        <at-flex-item :size="5" v-else>
          <at-button
            :disabled="ofPrice.ordered"
            size="small"
            @click="onResetClick"
          >Reset</at-button>
        </at-flex-item>
      </at-flex>
    </template>
  </view>
  <text v-else>{{content}}</text>
</template>

<script lang="ts">
import { isEndsWith, isStartsWith, rmvEndsOf } from '../commons'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import Taro from '@tarojs/taro'
export default defineComponent({
  props: {
    lindex: { type: Number, default: -1 },
    senderId: { type: String, required: true },
    content: { type: String, default: '' },
    topic: { type: String, required: true },
    good: { type: Object, required: true },
    orderConfirmed: { type: Function, required: true },
  },
  setup (props) {
    const store = useStore()
    const lgnUsr = store.getters.loginedUser
    const ofPrice = computed(() => pickFmOfPrice(props.content))

    function msgIsImage (content: string): boolean {
      return isStartsWith(content, 'http') && isEndsWith(content, '#image')
    }
    function msgIsOfPice (content: string): boolean {
      return isEndsWith(content, '#offerPrice')
    }
    function pickFmOfPrice (content: string): any {
      return JSON.parse(rmvEndsOf(content, '#offerPrice'))
    }
    function onOrderSubmit () {
      store.dispatch('showConfirm', {
        content: 'Are you sure? This operation will generate an order',
        confirmed: () => {
          props.orderConfirmed(ofPrice.value.price)
        }
      })
    }
    function onResetClick () {
      const params = [
        `lindex=${props.lindex}`,
        `topic=${props.topic}`,
        `unit=${props.good.unit}`,
      ].join('&')
      Taro.navigateTo({
        url: `../offerPrice/offerPrice?${params}`
      })
    }
    return {
      lgnUsr,
      ...props,
      ofPrice,

      msgIsImage,
      msgIsOfPice,
      pickFmOfPrice,
      onOrderSubmit,
      onResetClick
    }
  }
})
</script>

<style lang="scss">
.offer-price {
  .item-thumb {
    width: 100rpx;
    height: 100rpx;
  }
  .item-extra__info {
    color: #ff4949;
  }
}
</style>
