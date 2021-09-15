<template>
  <view hover-class="good-card-clicked" class="good-card" @tap="onGoodClicked">
    <image class="good-logo" mode="widthFix" :src="good.cover"/>
    <view class="good-info">
      <at-flex align="center" justify="around">
        <at-flex-item :size="8">
          <view class="line-1 good-title">{{good.name}}</view>
        </at-flex-item>
        <at-flex-item class="good-price" :size="1" is-auto>￥50</at-flex-item>
      </at-flex>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Taro from '@tarojs/taro'

export default defineComponent ({
  name: 'GoodCard',
  props: {
    good: { type: Object, required: true }
  },
  setup(props) {
    function onGoodClicked() {
      Taro.navigateTo({
        url: '../../pages/addGood/addGood'
      })
    }
    return {
      ...toRefs(props),

      onGoodClicked
    }
  }
})
</script>

<style lang="scss">
.good-card {
  padding-bottom: 10rpx;

  .good-logo {
    width: 100%;
    border-radius: 10rpx;
  }

  .good-info {
    .good-title {
      font-size: 10pt;
    }

    .good-price {
      color: #6190e8;
      // font-weight: bold;
      font-size: 10pt;
    }

    .good-spec {
      margin-top: -4px;
      background-color: #ffc82c;
      color: white;
    }

    .good-tag {
      display: inline-block;
      margin-right: 5rpx;
      border-color: #ff4949;
      color: #ff4949;
    }

    .good-tag:first {
      margin-right: 0 !important;
    }

    .good-location {
      color: #13ce66;
      border-color: #13ce66;
    }
  }
}

.good-card-clicked {
  box-shadow: none;
  background-color: #dedede;
}
</style>
