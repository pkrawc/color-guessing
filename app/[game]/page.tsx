"use client"

import styles from "./game-page.module.css"
import { useEffect, useReducer, useState } from "react"
import { supabase } from "@src/store"
import { Input } from "@src/ui"
import { GameBoard } from "./game-board"
import { GameDisplay } from "./game-display"

interface GameState {
  players: any[]
  turns: any[]
}

interface GameAction {
  type: string
  payload: any
}

// Store game state in supabase, and use a channel to sync it with other players.
function useGame(gameSlug: string, username: string | null) {
  const [gameState, dispatch] = useReducer(
    (state: GameState, action: GameAction) => ({ ...state, ...action.payload }),
    { players: [], turns: [] }
  )
  useEffect(() => {
    if (username) {
      const channel = supabase.channel(`game:${gameSlug}`, {
        config: { presence: { key: username } },
      })
      channel.on("presence", { event: "sync" }, () => {
        const sharedPlayers = Object.values(channel.presenceState()).map(
          (p) => p[0]
        )
        dispatch({
          type: "UPDATE_PLAYERS",
          payload: {
            players: sharedPlayers.sort(
              (a: any, b: any) => a.online - b.online
            ),
            me: sharedPlayers.find((p: any) => p.username === username),
          },
        })
      })
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "games",
          schema: "public",
          filter: `game_id=eq.${gameSlug}`,
        },
        (payload: any) => {
          dispatch({
            type: "NEW_TURN",
            payload: { turns: [...gameState, ...payload.new] },
          })
        }
      )
      channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            username,
            online: new Date().toISOString(),
          })
        }
      })
    }
  }, [username])
  return gameState
}

export default function GamePage({ params }: { params: { game: string } }) {
  const { game } = params
  const [name, setName] = useState<null | string>(null)
  const { players, me } = useGame(game, name)
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
        <GameDisplay players={players} url={game} me={me} />
        <GameBoard />
      </main>
    </div>
  )
}
