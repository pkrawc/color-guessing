"use client"

import React, { useContext } from "react"
import styles from "./game-page.module.css"

const colors = [
  "hsl(0, 100%, 50%)",
  "hsl(5, 100%, 50%)",
  "hsl(10, 100%, 50%)",
  "hsl(15, 100%, 50%)",
  "hsl(20, 100%, 50%)",
  "hsl(25, 100%, 50%)",
  "hsl(30, 100%, 50%)",
  "hsl(35, 100%, 50%)",
  "hsl(40, 100%, 50%)",
  "hsl(45, 100%, 50%)",
  "hsl(50, 100%, 50%)",
]

const gameTiles = new Array(480)
  .fill("")
  .map((_, i) => colors[i % colors.length])

const GameContext = React.createContext({ game: null })

function useGame() {
  const { game } = useContext(GameContext)
  return { game: { board: [[]] } }
}

export function GameBoard() {
  const { game } = useGame()
  const { board } = game

  return (
    <div className={styles.gameBoard}>
      {gameTiles.map((color, i) => (
        <div
          className={styles.gameTile}
          key={color + i}
          style={{ background: color }}
        />
      ))}
    </div>
  )
}
