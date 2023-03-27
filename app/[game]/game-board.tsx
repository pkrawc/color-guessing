"use client"

import React, { useContext } from "react"
import styles from "./game-page.module.css"
import boardData from "./board-data.json"

const GameContext = React.createContext({ game: null })

function useGame() {
  const { game } = useContext(GameContext)
  return { game, board: boardData }
}

export function GameBoard() {
  const { game, board } = useGame()

  return (
    <div className={styles.gameBoard}>
      {board.flat().map((color, i) => (
        <div
          className={styles.gameTile}
          key={color + i}
          style={{ background: color }}
        />
      ))}
    </div>
  )
}
