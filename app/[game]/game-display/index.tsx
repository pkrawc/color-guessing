"use client"

import { MouseEvent } from "react"
import styles from "./styles.module.css"

export function GameDisplay({ players, url, me }: any) {
  function handleCreateTurn(e: MouseEvent) {
    // Add turn to supabase table
  }

  function handleShare(e: MouseEvent) {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        url: `${window.location.origin}/${url}`,
        text: "Join my game",
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/${url}`)
    }
  }
  return (
    <div className={styles.gameDisplay}>
      <button onClick={handleCreateTurn}>Draw Card</button>
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
