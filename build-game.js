const cheerio = require("cheerio")
const fs = require("fs")

const boardSvg = fs.readFileSync("./board.svg", "utf8")

const $ = cheerio.load(boardSvg)

const rects = $("rect")

const gameColors = []

for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 30; x++) {
    const rect = $(rects[y * 30 + x])
    // const id = rect.attr("id")
    const color = rect.attr("fill")
    gameColors[y] = [...(gameColors[y] || []), color]
  }
}

console.log(gameColors)

fs.writeFileSync("./game.json", JSON.stringify(gameColors))
