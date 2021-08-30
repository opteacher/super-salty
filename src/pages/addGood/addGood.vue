<template>
  <at-form style="padding: 10rpx 8rpx">
    <at-input class="mb-20" type="text" 
      placeholder="input good name" 
      @change="val => form.name = val" 
    />
    <at-button class="mb-20" style="height: 200rpx; padding-top: 10rpx"
      @click="(e) => handleClick('secondary')"
    >
      <at-icon value="add" size="32" color="#CCC"></at-icon>
      <view style="color: #CCC">upload logo</view>
    </at-button>
    <at-textarea class="mb-20"
      @change="val => form.desc = val"
      :maxLength="200" placeholder="input good description"
    />
    <view class="at-article__h3 field-title">upload good's pictures</view>
    <at-image-picker
      class="mb-20"
      multiple
      length="5"
      :files="files"
      @change="onChange"
      @fail="onFail"
      @image-click="onImageClick"
    />
    <view>
      <at-button type="primary" formType="submit" @click="onSubmit">Submit</at-button>
      <at-button class="mt-5" formType="submit" @click="onSubmit">Review</at-button>
    </view>
  </at-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'addGood',
  setup() {
    const form = reactive({
      name: '',
      price: 0,
      desc: '',
      images: [],
      tags: []
    })
    const onSubmit = () => {
      console.log(form)
    }
    return {
      form,
      onSubmit
    }
  }
})
</script>

<style lang="scss">
.field-title {
  margin-left: 0;
  padding-left: 30rpx;
  border-left: 10rpx solid #6190E8;
  color: #8DABC4;
}
</style>

