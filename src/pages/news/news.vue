<template>
  <basic-layout class="container">
    <at-virtual-scroll
      bench="5"
      :height="listHeight"
      item-height="64"
      :items="news"
      @reach-top="onReachTop"
      @reach-bottom="onReachBtm"
    >
      <template #default="{ index, item }">
        <news-item :news="item"/>
        <at-divider :height="3"/>
      </template>
    </at-virtual-scroll>
  </basic-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import NewsItem from '../../components/NewsItem'
import BasicLayout from '../../components/BasicLayout'
import { getAllNews } from '../../api/news'

export default defineComponent({
  components: {
    NewsItem,
    BasicLayout
  },
  setup () {
    const news = ref(getAllNews())
    const listHeight = wx.getSystemInfoSync().windowHeight
    
    function onReachTop () {}
    function onReachBtn () {}
    return {
      news,
      listHeight,

      onReachTop,
      onReachBtn
    }
  }
})
</script>

<style lang="scss">
.author .item-thumb__info {
  border-radius: 100%;
}

.news-pics .content-inner__img {
  width: 32vw !important;
  height: 32vw !important;
}

.good-link {

  .item-thumb {
    width: 20vw !important;
    height: 20vw !important;

    .item-thumb__info {
      border-radius: 10rpx;
    }
  }

  .item-content__info-title {
    white-space: unset !important;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>

