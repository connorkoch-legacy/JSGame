var c = document.getElementById("myCanvas")


function initDraw() {
  var ctx = c.getContext("2d")
  ctx.canvas.width = window.innerWidth * 0.4
  ctx.canvas.height = ctx.canvas.width
  var sqSide = ctx.canvas.clientWidth / 4.5

  ctx.fillStyle = "#060606"
  ctx.fill()

  var xVals = []
  var offset = ctx.canvas.width / 8

  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      drawSquare(offset*(i+1) + sqSide * i, offset*(j+1) + sqSide * j, sqSide)
    }
  }

}

function drawSquare(leftX, topY, side) {


  ctx.fillStyle = "gray"
  ctx.fillRect(leftX, topY, sqSide, side)
}
