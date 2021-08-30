<template>
  <basic-layout>
    <view class="scroll-container p-0" style="bottom: 132rpx">
      <view class="at-article">
        <at-flex align="center" justify="around">
          <at-flex-item :size="6" class="pl-20">
            <text style="font-size: 10pt; color: #FF4949">{{good.price[1]}}</text>
            <text style="font-size: 15pt; color: #FF4949">{{good.price[0]}}</text>
          </at-flex-item>
          <at-flex-item :size="6" class="pr-20">
            <view class="at-article__info m-0 text-right">
              <text>
                <at-icon value="eye" size="20"/>&nbsp;99
              </text>&nbsp;
              <text>
                <at-icon value="heart" size="20"/>&nbsp;12
              </text>
            </view>
          </at-flex-item>
        </at-flex>
        <view class="at-article__h1 mt-0">{{good.name}}</view>
        <view style="margin: 0 30rpx">
          <at-tag
            v-for="(tag, idx) in good.tags" :key="idx"
            class="good-tag"
            circle
            :active="true"
          >{{tag}}</at-tag>
        </view>
        <at-flex align="center" justify="around">
          <at-flex-item :size="6">
            <at-list-item class="owner" :title="good.owner" :thumb="good.avatar"/>
          </at-flex-item>
          <at-flex-item :size="6">
            <view class="at-article__info text-right">
              <at-icon value="map-pin" size="20"/>&nbsp;{{good.location}}
            </view>
          </at-flex-item>
        </at-flex>
        <view class="at-article__content">
          <view class="at-article__section">
            <view class="at-article__p">{{good.desc}}</view>
          </view>
          <view class="at-article__section">
            <image v-for="(img, idx) in good.images" :key="idx"
              class="at-article__img" :src="img" mode="widthFix"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="fix-bottom p-0">
      <at-flex justify="around" align="center">
        <at-flex-item :size="3">
          <view hover-class="click-bkgd" class="oper-link right-border">
            <at-icon value="heart" size="25" color="#A8C6DF"/>
            <text class="inner-text">&nbsp;Like</text>
          </view>
        </at-flex-item>
        <at-flex-item :size="3">
          <view hover-class="click-bkgd" class="oper-link">
            <at-icon value="external-link" size="25" color="#A8C6DF"/>
            <text class="inner-text">&nbsp;Share</text>
          </view>
        </at-flex-item>
        <at-flex-item :size="6" style="padding: 20rpx 20rpx 20rpx 0">
          <at-button type="primary">
            <at-icon value="message" size="30"/>&nbsp;Chat now
          </at-button>
        </at-flex-item>
      </at-flex>
    </view>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import BasicLayout from '../../components/BasicLayout'

export default defineComponent ({
  name: 'goodDetail',
  components: {
    BasicLayout
  },
  props: {
    good: {
      type: Object,
      default: {
        name: 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd',
        owner: 'dsfsdfsfsfsfsdfsdfsfsdfsdfsfsfdssfd',
        avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.JeWIs0BziEpuWCEJYLQZogHaFS?pid=ImgDet&rs=1',
        desc: 'dsfdsfjgodjgodjffwijfpwmfojeorfeorgoerngonrmogfrofijpesfjpwfjperojfgowerjfoejrpgejrogerigoerij',
        price: [50, '￥'],
        logo: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.JeWIs0BziEpuWCEJYLQZogHaFS?pid=ImgDet&rs=1',
        images: [
          'https://tse1-mm.cn.bing.net/th/id/R-C.980be5bdb83fa934bbf321b1514571f1?rik=fNIj32mTiu386g&riu=http%3a%2f%2fpic21.nipic.com%2f20120531%2f9969356_181513630134_2.jpg&ehk=l1jS8GTS0ZArtbRXBpgOh%2fX8xBWi6gZn7QwlvuL10vY%3d&risl=&pid=ImgRaw&r=0',
          'https://tse1-mm.cn.bing.net/th/id/R-C.a7a487afd8487d2cb130231652adca65?rik=n984yib5xDVBWw&riu=http%3a%2f%2fpic38.nipic.com%2f20140222%2f17916857_203205384108_2.jpg&ehk=S6iHpOwt%2bEGVIWnnoxfneexgfUfqssYgzVIUTAnmB7w%3d&risl=&pid=ImgRaw&r=0',
          'https://tse1-mm.cn.bing.net/th/id/R-C.9fdb319058c1cff799db7e334879c229?rik=KkCaDfFnMexMWg&riu=http%3a%2f%2fpic18.nipic.com%2f20120206%2f7366519_110724384166_2.jpg&ehk=OvhcEzqeUG3CrOCjG6bVgqRpiBIDPR%2fTjRyYGQaTEfQ%3d&risl=&pid=ImgRaw&r=0',
          'https://tse1-mm.cn.bing.net/th/id/R-C.116f43b1d4077875c7cb5ea28e786691?rik=bWY%2fKthK1f27Mw&riu=http%3a%2f%2fimg.juimg.com%2ftuku%2fyulantu%2f140306%2f330804-14030622424570.jpg&ehk=GjOXLGIobXy9L8ytg%2bmToWIipx%2b8%2bGRiRmP6L8Ag1R8%3d&risl=&pid=ImgRaw&r=0'
        ],
        tags: ['local tradable', 'nearly new'],
        location: 'Shanghai'
      },
      required: true
    }
  },
  setup(props) {
    return {
      ...toRefs(props)
    }
  }
})
</script>

<style lang="scss">
.oper-link {
  text-align: center;
  padding: 20rpx 5rpx;

  .inner-text {
    font-size: 10pt;
    color: #A8C6DF;
    vertical-align: middle;
  }
}

.right-border {
  border-right: 1px solid #CCC5
}

.good-tag {
  margin-right: 10rpx;
  border-color: #78A4FA;
  color: #78A4FA;
}

.owner .item-thumb__info {
  border-radius: 100%;
}
</style>