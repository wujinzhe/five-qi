<template>
  <div class="five">
    <div class="canvas-wrap">
      <canvas id="canvas" width="600" height="600" @click="canvasClick" @mousemove="canvasMove"></canvas>
      <canvas id="canvasBack" width="600" height="600"></canvas>
    </div>
    <div>
      信息
      <button @click="test()">点击测试</button>
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
      user: {},
      otherUser: 'black',
      isWhite: true,
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
      blackPoints: [],
      // 白棋点所有位置记录
      whitePoints: [],
      // 所有棋的位置记录
      allPoints: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!to.query.id) {
      next(vm => {
        vm.$router.reload({path: '/room?id=' + +new Date()})
      })
    } else {
      next()
    }
    // getPost(to.params.id, (err, post) => {
    //   next(vm => vm.setData(err, post))
    // })
    // next()
  },
  created () {
    this.$socket.on('init', user => {
      this.user = user
    })
    this.$socket.on('otherPlay', point => {
      this.draw(this.otherUser, point.x * 30, point.y * 30)
      this.allPoints[`${point.x}/${point.y}`] = this.otherUser
    })
    this.$socket.on('startGame', e => {
      if (this.user.role == 'white') {
        alert('比赛开始,我方先下')
      } else if (this.user.role == 'black') {
        alert('比赛开始,我方先下')
      } else {
        alert('比赛开始')
      }
    })
    this.$socket.on('play', data => {
      this.play(data)
    })
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
    play (data) {
      if (data.role != this.user.role && this.user.role != 'passenger') {
        this.user.play = true
      }
      this.draw(data.role, data.x * 30, data.y * 30)
    },
    /* canvas 事件 */
    // canvas 点击事件
    canvasClick (e) {
      // 30 570
      if (!this.user.play) {
        return
      } else {
        this.user.play = false
      }
      var p = this.currentPoint
      // this.isWhite ? this.whitePoints.push([ p.x, p.y ]) : this.blackPoints.push([ p.x, p.y ])
      // 添加每个点的记录 白棋 type = 0  黑棋 type = 1
      if (isNaN(this.allPoints[`${p.x}/${p.y}`])) {
        this.draw(this.user.role, p.x * 30, p.y * 30)
        this.allPoints[`${p.x}/${p.y}`] = this.user
        // this.isWhite = !this.isWhite
        this.$socket.emit('play', { x: p.x, y: p.y, role: this.user.role})
      }
    },
    // 重绘所有棋子
    rePaint () {

    },
    // canvas 移动事件
    canvasMove (e) {
      var x = parseInt(e.offsetX / 30)
      var y = parseInt(e.offsetY / 30)

      if (!(e.offsetX < 18 || e.offsetX > 585 || e.offsetY > 585 || e.offsetY < 18)) {
        if (e.offsetX % 30 > 15) {
          x += 1
        }
        if (e.offsetY % 30 > 15) {
          y += 1
        }
        this.currentPoint.x = x
        this.currentPoint.y = y
        this.drawChoiceBox(x * 30, y * 30)
      }
    },
    /*****************/
    // 画选择框
    drawChoiceBox (x, y) {
      var history = this.choiceBoxRecord.history
      var qi = this.allPoints[`${parseInt(history.x / 30)}/${parseInt(history.y / 30)}`]

      if (history.x !== x || history.y !== y) {
        this.ctx.clearRect(history.x - 15, history.y - 15, 30, 30)
        // console.log(blackP)
        // console.log(whiteP)
        if (!isNaN(qi)) {
          this.draw(qi === 0 ? 'white' : 'black', history.x, history.y)
        }
        this.choiceBoxRecord.history = { x, y }
        this.ctx.drawImage(this.$refs.select, x - 15, y - 15, 30, 30)
      }
    },
    // 画黑，白棋子
    draw (type, x, y) {
      this.ctx.drawImage(this.$refs[type], x - 15, y - 15, 30, 30)
    },
    test () {
      this.$socket.emit('message', '我进来了')
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
</style>
