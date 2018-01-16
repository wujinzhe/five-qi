<template>
  <div>
    <canvas id="canvas" width="600" height="600" @click="canvasClick"></canvas>
    <div style="display:none;">
      <img src="../assets/image/white.png" ref="white">
      <img src="../assets/image/black.png" ref="black">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  data () {
    return {
      ctx: null,
      isWhite: true
    }
  },
  created () {

  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    initCanvas () {
      this.ctx = document.getElementById('canvas').getContext('2d')
    },
    canvasClick (e) {
      this.draw(this.isWhite ? 'white' : 'black', e.offsetX, e.offsetY)
      this.isWhite = !this.isWhite
    },
    draw (type, x, y) {
      if (this.ctx) {
        this.ctx.drawImage(this.$refs[type], x - 15, y - 15, 30, 30)
      }
    }
  }
}
</script>

<style scoped>
  canvas {
    width: 600px;
    height: 600px;
    margin-top: 100px;
    margin-left: 100px;
  }
</style>
