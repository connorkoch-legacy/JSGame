document.addEventListener("DOMContentLoaded", () => {
  var c = document.getElementById("myCanvas")
  initDraw(c)
});

class Tile {
  constructor(x, y, value) {
    this.x = x
    this.y = y
    this.value = value
    this.color = "white"
    this.direction = directionEnum["none"]
    const directionEnum = {"none":0, "up":1, "down":2, "left":3, "right":4}
  }

  //function move() {

  //}
}

function initDraw(c) {
  var ctx = c.getContext("2d")
  ctx.canvas.width = window.innerWidth * 0.4
  ctx.canvas.height = ctx.canvas.width
  var sqSide = ctx.canvas.clientWidth / 4.5

  ctx.fillStyle = "#6F6F6F"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  var offset = ctx.canvas.width / 22.5

  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      drawSquare(offset*(i+1) + sqSide * i, offset*(j+1) + sqSide * j, sqSide, ctx)
    }
  }

  var table = []
  for (x = 0; x < 4; x++) {
    table.push([])
    for (y = 0; y < 4; y++){
      table[x][y] = null
    }
  }

}

function drawSquare(leftX, topY, side, ctx) {
  ctx.fillStyle = "#AAAAAA"
  ctx.fillRect(leftX, topY, side, side)
}
