"use client"

import { useEffect, useState } from "react"
import styles from "./game-page.module.css"
import { realtime } from "@src/store"

export default function GamePage({ params }: { params: { game: string } }) {
  const { game } = params
  const [players, setPlayers] = useState<any[]>([])
  useEffect(() => {
    const channel = realtime.channel(`game:${game}`, {
      config: {
        presence: {
          key: game,
        },
      },
    })

    channel.on("presence", { event: "join" }, (payload: any) => {
      console.log("real join event", payload)
    })

    channel.on("broadcast", { event: "joined" }, (payload) => {
      console.log("joined", payload)
    })

    channel.subscribe(() => {
      channel.send({
        type: "broadcast",
        event: "joined",
        payload: { name: "test" },
      })
    })
  }, [])
  return (
    <main className={styles.gameMain}>
      <div>
        <h1>Game Page</h1>
        <p>{game}</p>
        <p>Players:</p>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
