<template>
  <basic-layout>
    <at-form @onSubmit="onFormSubmit" :reportSubmit="true">
      <at-input
        autoFocus
        clear
        :error="errMsgs.phone !== ''"
        name="phone"
        type="phone"
        placeholder="input phone"
        :value="phone"
        @change="val => { phone = onFieldChanged('phone', val) }"
      >
        <view
          :style="{
            color: sdCdDisabled ? '#FF4949' : '',
            fontSize: '12px',
            width: '90px',
          }"
          @tap="onSendCode"
        >{{ showTipText() }}</view>
      </at-input>
      <view v-if="errMsgs.phone !== ''" class="at-article__info" style="color: #FF4949">
        {{errMsgs.phone}}
      </view>
      <at-input
        required
        type="text"
        placeholder="input SMS verfication code"
        @change="val => {}"
      />
      <at-input
        :error="errMsgs.password !== ''"
        name="password"
        type="password"
        placeholder="input password"
        :value="password"
        @change="val => { password = onFieldChanged('password', val) }"
      />
      <view v-if="errMsgs.password !== ''" class="at-article__info" style="color: #FF4949">
        {{errMsgs.password}}
      </view>
      <at-input
        clear
        required
        type="text"
        placeholder="input verfication code"
        :maxLength="5"
        :value="verfCode"
        @change="val => { verfCode = onFieldChanged('verfCode', val) }"
      >
        <verf-code width="100" height="25" :onRefresh="onVfCdRefreshed"/>
      </at-input>
      <view v-if="errMsgs.verfCode !== ''" class="at-article__info" style="color: #FF4949">
        {{errMsgs.verfCode}}
      </view>
      <view style="padding: 20rpx 10rpx">
        <at-button type="primary" formType="submit" @click="onFormSubmit">Login / Register</at-button>
        <view class="at-article__info mt-20">forgot password?&nbsp;
          <navigator style="display: inline-block; color: #78A4FA">click here</navigator>
        </view>
      </view>
    </at-form>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import VerfCode from '../../components/VerfCode.vue'
import { validateForm } from '../../utils'
import { login } from '../../api/user'
import Taro from '@tarojs/taro'

interface LoginFormState {
  phone: string
  password: string,
  verfCode: string
}

export default defineComponent({
  name: 'login',
  components: {
    BasicLayout,
    VerfCode
  },
  setup() {
    const formState = reactive<LoginFormState>({
      phone: '', password: '', verfCode: ''
    })
    const formOpnState = reactive({
      sdCdDisabled: false,
      errMsgs: {
        phone: '',
        password: '',
        verfCode: ''
      }
    })
    const formRules = {
      phone: {
        required: true, // 必填选项
        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, // 【字符串专有】匹配的正则
        // length: 10, 【字符串专有】要求的字符串长度
        // max: 10, 最大的值（如果是字符串则为最大长度）
        // min: 0, 最小的值（如果是字符串则为最小长度）
        // enum: [], 给出值必须是其中的一项
      },
      password: {
        required: true,
        max: 18,
        min: 6
      },
      verfCode: {
        required: true,
        pattern: ''
      },
    }

    function onSendCode () {
      console.log('TTTTTTT')
    }
    function showTipText () {
      return 'send code'
    }
    function onVfCdRefreshed (verfCode) {
      formRules.verfCode.pattern = verfCode
      console.log(formRules)
    }
    async function onFormSubmit () {
      const chkRes = validateForm(formState, formRules)
      if (chkRes[0].length) {
        formOpnState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        try {
          console.log(await login(formState))
        } finally {
          Taro.switchTab({ url: '../../pages/index/index' })
        }
      }
    }
    function onFieldChanged (key: string, val: any) {
      const chkRes = validateForm({[key]: val}, formRules, [key])
      if (chkRes[0].length) {
        formOpnState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        formOpnState.errMsgs[key] = ''
      }
      return val
    }

    return {
      ...toRefs(formState),
      ...toRefs(formOpnState),
      formRules,

      onSendCode,
      showTipText,
      onFormSubmit,
      validateForm,
      onVfCdRefreshed,
      onFieldChanged
    }
  }
})
</script>
