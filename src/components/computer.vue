<template>
  <div class="five">
    <div class="canvas-wrap">
      <canvas id="canvas" width="600" height="600" @click="canvasClick" @mousemove="canvasMove"></canvas>
      <canvas id="canvasBack" width="600" height="600"></canvas>
      <div class="alert" v-text="alertText" v-show="alertShow"></div>
    </div>
    <div style="display:none;">
      <img src="../assets/image/white.png" ref="white">
      <img src="../assets/image/black.png" ref="black">
      <img src="../assets/image/chessboard.jpg" ref="board">
      <img src="../assets/image/select.png" ref="select">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      ctx: null,
      alertText: '你赢了',
      alertShow: false,
      isEnd: false,
      user: 'white', // 当前玩家的棋子
      otherUser: 'black', // 对方玩家的棋子
      isPlay: true, // 判断是否可以下子
      // 选择框的上一个位置的记录
      choiceBoxRecord: {
        history: {
          x: 0,
          y: 0
        }
      },
      // 当前点的位置记录 并不是位置坐标 而是数组的下标
      currentPoint: {
        x: 0,
        y: 0
      },
      // 黑棋点所有位置记录
      blackPoints: {},
      // 白棋点所有位置记录
      whitePoints: {},
      // 所有棋的位置记录
      allPoints: {}
    }
  },
  created () {
    this.$socket.on('computer', role => {})
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    // 初始化画布
    initCanvas () {
      this.ctx = document.getElementById('canvas').getContext('2d')

      var canvasBack = document.getElementById('canvasBack').getContext('2d')
      this.$refs.board.onload = function () {
        canvasBack.drawImage(this.$refs.board, 0, 0, 600, 600)
      }.bind(this)
    },
    /* canvas 事件 */
    // canvas 点击事件
    canvasClick (e) {
      // 30 570
      var p = this.getPoint({x: e.offsetX, y: e.offsetY})
      // 添加每个点的记录 白棋 type = 0  黑棋 type = 1
      if (p && !this.allPoints[`${p.x}/${p.y}`] && this.isPlay && !this.isEnd) {
        this.draw(this.user, p.x * 30, p.y * 30)
        this.allPoints[`${p.x}/${p.y}`] = this.user
        this.$socket.emit('play', { x: p.x, y: p.y })
        this.isPlay = false
      }
    },
    // 重绘所有棋子
    rePaint () {

    },
    // canvas 移动事件
    canvasMove (e) {
      var point = this.getPoint({x: e.offsetX, y: e.offsetY})
      if (point && !this.isEnd) {
        this.drawChoiceBox(point.x * 30, point.y * 30)
      }
    },
    getPoint (point) {
      if (point.x > 18 && point.x < 585 && point.y < 585 && point.y > 18) {
        var x = parseInt(point.x / 30)
        var y = parseInt(point.y / 30)

        if (point.x % 30 > 15) {
          x += 1
        }
        if (point.y % 30 > 15) {
          y += 1
        }
        return {x, y}
      }
      return false
    },
    /*****************/
    // 画选择框
    drawChoiceBox (x, y) {
      var history = this.choiceBoxRecord.history
      var qi = this.allPoints[`${parseInt(history.x / 30)}/${parseInt(history.y / 30)}`]

      if (history.x !== x || history.y !== y) {
        this.ctx.clearRect(history.x - 15, history.y - 15, 30, 30)

        if (qi) {
          this.draw(qi, history.x, history.y)
        }
        this.choiceBoxRecord.history = { x, y }
        this.ctx.drawImage(this.$refs.select, x - 15, y - 15, 30, 30)
      }
    },
    // 画黑，白棋子
    draw (type, x, y) {
      this.ctx.drawImage(this.$refs[type], x - 15, y - 15, 30, 30)
    }
  }
}
</script>

<style scoped>

  canvas {
    width: 600px;
    height: 600px;
    position: absolute;
    top: 0;
    left: 0;
  }
  #canvas {
    z-index: 10;
  }
  .canvas-wrap {
    position: relative;
    width: 600px;
    height: 600px;
    /* cursor: none; */
    margin-left: 50px;
    margin-top: 50px;
  }
   @media (max-width: 500px){
    .canvas-wrap {
      position: relative;
      width: 100vw;
      height: 100vw;
      margin: 50px 0;
    }
    canvas {
      width: 100vw;
      height: 100vw;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .alert {
    width: 100px;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.733);
    color: white;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    z-index: 10;
  }
</style>
