"use client"

import React from "react"
import styles from "./styles.module.css"

interface Tile {
  color: string
  x: number
  y: number
}

export function GameBoard({
  board,
  hinter,
}: {
  board: Tile[][]
  hinter: boolean
}) {
  return (
    <div className={styles.gameBoard}>
      {board.flat().map(({ color }, i) => (
        <div
          className={styles.gameTile}
          key={color + i}
          style={{ background: color, opacity: hinter ? 0.5 : 1 }}
        />
      ))}
    </div>
  )
}
