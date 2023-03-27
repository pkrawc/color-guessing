"use client"

import styles from "./styles.module.css"

export function GameDisplay({ players, url }: any) {
  return (
    <div className={styles.gameDisplay}>
      <button>Start Game</button>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (navigator.share) {
            navigator.share({
              url: `${window.location.origin}/${url}`,
              text: "Join my game",
            })
          } else {
            navigator.clipboard.writeText(`${window.location.origin}/${url}`)
          }
        }}
      >
        <img src="/share.svg" alt="share icon" />
      </button>
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
