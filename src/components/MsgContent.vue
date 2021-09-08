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
    <at-divider :height="50" lineColor="#78A4FA"/>
    <at-button
      class="mr-0"
      type="primary"
      :active="true"
      size="small"
      style="width: 200rpx"
      @click="onOrderSubmit"
    >Accept</at-button>
  </view>
  <text v-else>{{content}}</text>
</template>

<script lang="ts">
import { isEndsWith, isStartsWith, rmvEndsOf } from '../commons'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  props: {
    content: { type: String, default: '' },
    good: { type: Object, required: true }
  },
  setup (props) {
    const store = useStore()
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
          console.log('asdfdsfsdfsdfsdfsdf')
        }
      })
    }
    return {
      ...props,
      ofPrice,

      msgIsImage,
      msgIsOfPice,
      pickFmOfPrice,
      onOrderSubmit
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
