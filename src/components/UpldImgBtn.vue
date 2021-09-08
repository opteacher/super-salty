<template>
  <at-button class="upld-img-btn" @click="onUploadImgClicked" :style="{ height }">
    <view v-if="!form[prop].length || !display" class="h-100 center-container">
      <view v-if="direction === 'vertical'">
        <at-icon value="add" size="32"/>
        <view>{{placeholder}}</view>
      </view>
      <template v-else-if="direction === 'horizontal'">
        <at-icon value="add" size="20"/>&nbsp;
        <view>{{placeholder}}</view>
      </template>
    </view>
    <image v-else mode="scaleToFill" :src="form[prop]"/>
  </at-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { uploadImage } from '../commons'

export default defineComponent({
  name: 'UploadImageButton',
  props: {
    'form': { type: Object, required: true },
    'prop': { type: String, required: true },
    'placeholder': { type: String, default: 'Upload image' },
    'display': { type: Boolean, default: true },
    'complete': { type: Function, default: () => {} },
    'height': { type: String, default: '500rpx' },
    'direction': { type: String, default: 'vertical' }
  },
  setup (props) {
    async function onUploadImgClicked () {
      const imgURL = await uploadImage()
      const ptype = typeof props.form[props.prop]
      if (ptype === 'object') {
        props.form[props.prop].push(imgURL)
      } else {
        props.form[props.prop] = imgURL
      }
      props.complete(imgURL)
    }

    return {
      ...props,

      onUploadImgClicked
    }
  }
})
</script>

<style lang="scss">
.upld-img-btn {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  border: 1px dashed #c5d9e8;
  color: #8dabc4;

  .at-button__text {
    width: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
