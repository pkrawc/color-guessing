"use client"

import styles from "./game-page.module.css"
import { useState } from "react"
import { Input } from "@src/ui"
import { GameBoard } from "./game-board"
import { GameDisplay } from "./game-display"
import { useGame, GameProvider } from "./game-state"

export default function GamePage({ params }: { params: { id: string } }) {
  const { id } = params
  const [name, setName] = useState<null | string>(null)
  const { players, me, colorData, hinter } = useGame(id, name)
  function handleNameSubmit(e: any) {
    e.preventDefault()
    const name = e.target.name.value.toUpperCase()
    setName(name)
  }
  if (!name) {
    return (
      <main className={styles.formMain}>
        <form className={styles.form} onSubmit={handleNameSubmit}>
          <p>Enter your initials to join the game.</p>
          <Input
            id="name"
            label="Your Initials"
            required
            pattern="[a-zA-Z0-9]+"
          />
          <button>Set Name</button>
          <p>Share this URL with anyone you want to play with.</p>
        </form>
      </main>
    )
  }
  return (
    <div className={styles.gameWrapper}>
      <main className={styles.gameMain}>
        <GameProvider id={id} username={name}>
          <GameDisplay id={id} />
          <GameBoard board={colorData} hinter={hinter} />
        </GameProvider>
      </main>
    </div>
  )
}
