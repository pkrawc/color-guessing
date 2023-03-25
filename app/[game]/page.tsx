"use client"

import styles from "./game-page.module.css"
import { useEffect, useState } from "react"
import { supabase } from "@src/store"
import { Input } from "@src/ui"

interface Player {
  userId: string
  score: number
  presence_ref: string
}

export default function GamePage({ params }: { params: { game: string } }) {
  const { game } = params
  const [name, setName] = useState<null | string>(null)
  const [channel, setChannel] = useState<null | any>(null)
  const [players, setPlayers] = useState<[string, Player][]>([])
  useEffect(() => {
    if (name) {
      const channel = supabase.channel(`game:${game}`, {
        config: { presence: { key: name } },
      })
      setChannel(channel)
    }
  }, [name])
  useEffect(() => {
    if (channel) {
      // channel.on("presence", { event: "join" }, (payload: any) => {
      //   console.log("presence:subscribed", payload)
      // })
      channel.on("presence", { event: "sync" }, () => {
        const sharedPlayers = Object.entries<Player>(channel.presenceState())
        setPlayers(sharedPlayers)
      })
      channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ userId: name, score: 0 })
        }
      })
    }
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setChannel(null)
      }
    }
  }, [channel])
  function handleNameSubmit(e: any) {
    e.preventDefault()
    const name = e.target.name.value
    setName(name)
  }
  if (!name) {
    return (
      <main className={styles.formMain}>
        <form className={styles.form} onSubmit={handleNameSubmit}>
          <p>
            Create a username to join the game. You can use any name you want,
            but it must be unique and only contain letters and numbers.
          </p>
          <Input
            id="name"
            label="Username"
            required
            pattern="[a-zA-Z0-9]+"
            error="Cannot contain spaces"
          />
          <button>Set Name</button>
        </form>
      </main>
    )
  }
  return (
    <main className={styles.gameMain}>
      <div>
        <h1>Game Page</h1>
        <ul>
          {players.map(([name, obj]) => (
            <li key={obj.presence_ref}>{name}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
