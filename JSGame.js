document.addEventListener("DOMContentLoaded", () => {
  var c = document.getElementById("myCanvas")
  initDraw(c)
});
function initDraw(c) {

  var ctx = c.getContext("2d")
  ctx.canvas.width = window.innerWidth * 0.4
  ctx.canvas.height = ctx.canvas.width
  var sqSide = ctx.canvas.clientWidth / 4.5

  ctx.fillStyle = "darkgray"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  var offset = ctx.canvas.width / 22.5

  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      drawSquare(offset*(i+1) + sqSide * i, offset*(j+1) + sqSide * j, sqSide, ctx)
    }
  }
}

function drawSquare(leftX, topY, side, ctx) {
  ctx.fillStyle = "gray"
  ctx.fillRect(leftX, topY, side, side)
}
