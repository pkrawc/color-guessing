"use client"

import styles from "./styles.module.css"
import { MouseEvent } from "react"
import { supabase } from "@src/store"
import { useGameState } from "../game-state"

export function GameDisplay({ id }: { id: string }) {
  const { players, me } = useGameState()
  async function handleCreateTurn(e: MouseEvent) {
    // Add turn to supabase table
    e.preventDefault()
    const { error } = await supabase.from("turns").insert({
      game_id: id,
      hinter_id: me.presence_ref,
    })
    if (error) {
      console.log(error)
    }
  }

  function handleShare(e: MouseEvent) {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        url: `${window.location.origin}/game/${id}`,
        text: "Join my game",
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/${id}`)
    }
  }
  return (
    <div className={styles.gameDisplay}>
      <button onClick={handleCreateTurn}>Pick Color</button>
      <button onClick={handleShare}>
        <img src="/share.svg" alt="share icon" />
      </button>
      <ul className={styles.playerList}>
        {players.map(({ username, presence_ref }: any) => (
          <li className={styles.playerAvatar} key={presence_ref}>
            {username}
          </li>
        ))}
      </ul>
    </div>
  )
}
