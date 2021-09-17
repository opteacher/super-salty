<template>
  <view class="news">
    <at-flex align="center" justify="around">
      <at-flex-item :size="6">
        <at-list-item class="author" :title="news.author" :thumb="news.avatar"/>
      </at-flex-item>
      <at-flex-item :size="6">
        <view class="at-article__info text-right">{{news.createdAt}}</view>
      </at-flex-item>
    </at-flex>
    <view class="at-article__content">
      <view class="at-article__section">
        <view class="at-article__p">{{news.content}}</view>
      </view>
      <view v-if="news.images.length" class="at-article__section">
        <at-grid class="news-pics" :hasBorder="false"
          :data="news.images.map(image => ({image}))"
        />
      </view>
    </view>
    <at-divider :height="30" lineColor="#6190E8">
      <at-icon value="chevron-down"/>
    </at-divider>
    <at-list-item
      class="good-link"
      :title="news.good.title"
      :thumb="news.good.logo"
      :extraText="news.good.price[1] + news.good.price[0] + ' '"
      arrow="right"
      @tap="onGoodClicked"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import Taro from '@tarojs/taro'

export default defineComponent({
  name: 'NewsItem',
  props: {
    news: { type: Object, required: true }
  },
  setup(props) {
    function onGoodClicked () {
      Taro.navigateTo({
        url: '../goodDtl/goodDtl'
      })
    }

    return {
      ...toRefs(props),

      onGoodClicked
    }
  }
})
</script>

