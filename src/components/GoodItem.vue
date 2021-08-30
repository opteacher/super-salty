<template>
  <view>
    <at-flex class="good-item" hover-class="click-bkgd" @tap="onItemClicked">
      <at-flex-item class="good-logo" :size="1" is-auto>
        <image class="ml-12" mode="center" :src="good.logo"/>
      </at-flex-item>
      <at-flex-item style="overflow: hidden">
        <view class="at-article__h2 mt-0 good-name">{{good.name}}</view>
        <view class="at-article__info">
          <at-flex align="center" justify="around">
            <at-flex-item :size="6">
              <at-icon value="map-pin" size="20"/>&nbsp;{{good.location}}
            </at-flex-item>
            <at-flex-item :size="6" class="text-right">
              <at-icon value="heart" size="20"/>&nbsp;12
            </at-flex-item>
          </at-flex>
        </view>
        <view class="at-article__p">
          <text class="good-price" style="font-size: 10pt">{{good.price[1]}}</text>&nbsp;
          <text class="good-price" style="font-size: 15pt">{{good.price[0]}}</text>&nbsp;
        </view>
      </at-flex-item>
    </at-flex>
    <at-divider v-if="btmBorder" :height="1"/>
  </view>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Taro from '@tarojs/taro'

export default defineComponent({
  name: 'GoodItem',
  props: {
    good: { type: Object, required: true },
    btmBorder: { type: Boolean, default: true }
  },
  setup(props) {
    function onItemClicked () {
      Taro.navigateTo({
        url: '../../pages/goodDtl/goodDtl'
      })
    }
    return {
      ...toRefs(props),

      onItemClicked
    }
  }
})
</script>

<style lang="scss">
.good-item {
  padding: 20px 0;

  .good-logo {
    height: 22vw;

    image {
      width: 28vw;
      height: 22vw
    }
  }

  .good-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis; 
  }

  .good-price {
    color: #FF4949;
    vertical-align: bottom;
  }

  .good-tag {
    margin-right: 5rpx;
    // border-color: #FF4949;
    // color: #FF4949;
  }
}
</style>
