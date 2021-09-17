<template>
  <basic-layout>
    <at-form @onSubmit="onFormSubmit" :reportSubmit="true">
      <valid-input
        field="phone"
        ftype="phone"
        :form-state="formState"
      >
        <view
          v-if="mode === 'regup'"
          :style="{
            color: sdCdDisabled ? '#FF4949' : '',
            fontSize: '12px',
            width: '90px',
          }"
          @tap="onSendCode"
        >{{ showTipText() }}</view>
      </valid-input>
      <at-input
        v-if="mode === 'regup'"
        required
        type="text"
        placeholder="input SMS verfication code"
        @change="val => {}"
      />
      <valid-input
        field="password"
        ftype="password"
        :form-state="formState"
      />
      <valid-input
        v-if="mode === 'regup'"
        field="verfCode"
        :form-state="formState"
      >
        <verf-code
          width="100" height="25"
          :onRefresh="onVfCdRefreshed"
        />
      </valid-input>
      <view style="padding: 20rpx 10rpx">
        <at-button type="primary" formType="submit" @click="onFormSubmit">
          Login / Register
        </at-button>
        <view class="at-article__info mt-20">forgot password?&nbsp;
          <navigator class="inline-link">click here</navigator>
        </view>
      </view>
    </at-form>
    <at-modal :isOpened="rgpCfmVisible">
      <at-modal-header>Warning</at-modal-header>
      <at-modal-content>
        <view>
          The phone number has not registered in our system,
          would you like to register and login right now?
        </view>
        <view>
          Or you just inputed wrong password. Then check
          your account's password or try to
          <navigator class="inline-link">find your passowrd</navigator> back
        </view>
      </at-modal-content>
      <at-modal-action>
        <at-button class="w-100 br-0 b-0"
          @click="rgpCfmVisible = false"
        >Cancel</at-button>
        <at-button type="primary" class="w-100 br-0 b-0"
          @click="mode = 'regup'; rgpCfmVisible = false"
        >OK</at-button>
      </at-modal-action>
    </at-modal>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import VerfCode from '../../components/VerfCode.vue'
import { FormState } from '../../commons'
import { useStore } from 'vuex'
import Taro from '@tarojs/taro'
import ValidInput from '../../components/ValidInput.vue'
export default defineComponent({
  name: 'login',
  components: {
    BasicLayout,
    VerfCode,
    ValidInput
  },
  setup() {
    const store = useStore()
    const formState = new FormState({
      phone: { default: '', rule: { required: true, pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ } },
      password: { default: '', rule: { required: true, max: 18, min: 6 } },
      avatar: { default: 'http://cdn.opteacher.top/super-salty/assets/images/my_light.png', rule: { required: true } },
      verfCode: { default: '', rule: { required: true, pattern: '' } }
    }, 'phone')
    const optionState = reactive({
      mode: 'login',
      sdCdDisabled: false,
      rgpCfmVisible: false
    })

    function onSendCode () {
      console.log('TTTTTTT')
    }
    function showTipText () {
      return 'send code'
    }
    function onVfCdRefreshed (verfCode) {
      formState.rules.verfCode.pattern = verfCode
    }
    async function onFormSubmit () {
      const chkRes = formState.validateForm(undefined,
        optionState.mode === 'login' ? ['verfCode'] : []
      )
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        try {
          if (optionState.mode === 'regup') {
            await store.dispatch('regup', formState.form)
          }
          await store.dispatch('login', formState.form)
        } catch (err) {
          if (err.code && err.code === 4000) {
            optionState.rgpCfmVisible = true
          }
          return
        }
        Taro.switchTab({ url: '../index/index' })
      }
    }
    return {
      formState,
      ...formState.toRefs(),
      ...toRefs(optionState),

      onSendCode,
      showTipText,
      onFormSubmit,
      onVfCdRefreshed
    }
  }
})
</script>
