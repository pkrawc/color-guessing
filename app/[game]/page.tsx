"use client"

import styles from "./game-page.module.css"
import { useEffect, useState } from "react"
import { supabase } from "@src/store"
import { Input } from "@src/ui"
import colors from "./colors.json"
import gameData from "./game.json"
import { GameBoard } from "./game-board"

interface Player {
  userId: string
  score: number
  presence_ref: string
}

export default function GamePage({ params }: { params: { game: string } }) {
  const { game } = params
  const [name, setName] = useState<null | string>(null)
  const [channel, setChannel] = useState<null | any>(null)
  const [players, setPlayers] = useState<any>([])
  useEffect(() => {
    if (name) {
      const nextChannel = supabase.channel(`game:${game}`, {
        config: { presence: { key: name } },
      })
      nextChannel.on("presence", { event: "sync" }, () => {
        const sharedPlayers = Object.entries(nextChannel.presenceState())
        setPlayers(sharedPlayers)
      })
      nextChannel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await nextChannel.track({ userId: name, score: 0 })
        }
      })
      setChannel(nextChannel)
    }
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setChannel(null)
      }
    }
  }, [name])
  function handleNameSubmit(e: any) {
    e.preventDefault()
    const name = e.target.name.value
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
    <main className={styles.gameMain}>
      <GameBoard />
      <GameDisplay players={players} />
    </main>
  )
}

function GameDisplay({ players }: any) {
  return (
    <div className={styles.gameDisplay}>
      <ul className={styles.playerList}>
        {players.map(([name, obj]: any) => (
          <li className={styles.playerAvatar} key={name}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GameBoard() {
  return (
    <div className={styles.gameGrid}>
      {gameData.flat().map((color) => (
        <div className={styles.colorSquare} style={{ background: color }} />
      ))}
    </div>
  )
}
