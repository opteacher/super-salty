<template>
  <canvas id="cvsVerfCode" type="2d" :style="{
    width: width + 'px', height: height + 'px', 'z-index': 1
  }" @tap="onClicked"/>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'

interface Color {
  r: number
  g: number
  b: number
}

export default defineComponent({
  name: 'VerfCode',
  props: {
    'width': String,
    'height': String,
    'diff': {
      validator: value => ['high', 'mid', 'low'].indexOf(value) !== -1,
      default: 'mid'
    },
    'onRefresh': {
      type: Function,
      default: null
    }
  },
  setup(props) {
    const cvsWid = parseInt(props.width)
    const cvsHgt = parseInt(props.height)
    const cdInfo = reactive({
      code: '', colors: new Array<Color>()
    })
    const letters: string[] = []
    for (let i = 48; i <= 57; ++i) {
      letters.push(String.fromCharCode(i))
    }
    for (let i = 65; i <= 90; ++i) {
      letters.push(String.fromCharCode(i))
    }
    for (let i = 97; i <= 122; ++i) {
      letters.push(String.fromCharCode(i))
    }
    const diffMapper = {
      'low': 0.9,
      'mid': 0.6,
      'high': 0.3
    }

    function refresh () {
      cdInfo.code = ''
      cdInfo.colors = []
      for (let i = 0; i < 5; ++i) {
        const letter = genRandText()
        cdInfo.code += letter.letter
        cdInfo.colors.push(letter.color)
      }
      Taro.createSelectorQuery().select('#cvsVerfCode').fields({
        node: true, size: true
      }).exec(res => {
        const canvas = res[0].node
        const context = canvas.getContext('2d')
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)
        drawText(context, cdInfo, {
          left: 0, top: 0,
          width: canvas.width,
          height: canvas.height
        })
        const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < (imgData.width * imgData.height) << 2; i += 3) {
          if (Math.random() > diffMapper[props.diff]) {
            imgData.data[i] = Math.random() * 255
            imgData.data[i + 1] = Math.random() * 255
            imgData.data[i + 2] = Math.random() * 255
          }
        }
        context.putImageData(imgData, 0, 0)
      })
      props.onRefresh && props.onRefresh(cdInfo.code)
    }
    function drawText (context, txtInfo, rect) {
      const wdWid = rect.width / txtInfo.code.length
      for (let i = 0; i < txtInfo.code.length; ++i) {
        const fontSz = Math.min(wdWid, rect.height)
        const color = txtInfo.colors[i]
        // context.fillStyle = `rgb(${255 - color.r}, ${255 - color.g}, ${255 - color.b})`
        // context.fillRect(wdWid * i, rect.top, wdWid, rect.height)
        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        context.font = `bold ${fontSz}px Arial`
        const txtRect = context.measureText(txtInfo.code[i])
        context.fillText(txtInfo.code[i],
          (wdWid * i) + (wdWid >> 1) - (txtRect.width >> 1),
          rect.top + (rect.height >> 1) + (fontSz >> 1)
        )
      }
    }
    function genRandText () {
      return {
        letter: letters[
          Math.floor(Math.random() * letters.length)
        ],
        color: {
          r: Math.random() * 200,
          g: Math.random() * 200,
          b: Math.random() * 200
        }
      }
    }
    const onClicked = (e) => {
      e.preventDefault()
      refresh()
    }
    onMounted(() => {
      Taro.nextTick(refresh)
    })
    return {
      width: props.width,
      height: props.height,
      cvsWid,
      cvsHgt,
      cdInfo,
      letters,
      onClicked
    }
  }
})
</script>
