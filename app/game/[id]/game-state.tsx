"use client"

import {
  useEffect,
  useReducer,
  createContext,
  ReactNode,
  Dispatch,
  useContext,
} from "react"
import { supabase } from "@src/store"
import colorData from "./color-data.json"

interface Player {
  presence_ref: string
  username: string
  online: string
}

interface GameState {
  players: any[]
  turns: any[]
  me: Player | null
  activeTurn: boolean
  hinter: boolean
}

interface GameAction {
  type: string
  payload: any
}

// const GameContext = createContext(null)
// const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null)

function gameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "UPDATE_PLAYERS":
      return {
        ...state,
        ...action.payload,
      }
    case "NEW_TURN":
      return {
        ...state,
        turns: [...state.turns, action.payload],
        activeTurn: true,
        hinter: state.me?.presence_ref === action.payload.hinter_id,
      }
    default:
      return state
  }
}

// export function GameProvider({ children }: { children: ReactNode }) {
//   const [gameState, dispatch] = useReducer(gameReducer, {
//     players: [],
//     turns: [],
//     me: null,
//     activeTurn: false,
//     colorData,
//     hinter: false,
//   })
//   return (
//     <GameContext.Provider value={gameState}>
//       <GameDispatchContext.Provider value={dispatch}>
//         {children}
//       </GameDispatchContext.Provider>
//     </GameContext.Provider>
//   )
// }

// export function useGameState() {
//   const context = useContext(GameContext)
//   if (context === undefined) {
//     throw new Error("useGameState must be used within a GameProvider")
//   }
//   return context
// }

export function useGame(id: string, username: string | null) {
  const [gameState, dispatch] = useReducer(gameReducer, {
    players: [],
    turns: [],
    me: null,
    activeTurn: false,
    colorData,
    hinter: false,
  })
  useEffect(() => {
    if (username) {
      const channel = supabase.channel(`game:${id}`, {
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
          table: "turns",
          schema: "public",
          filter: `game_id=eq.${id}`,
        },
        (payload: any) => {
          console.log("new turn", payload)
          dispatch({
            type: "NEW_TURN",
            payload: payload.new,
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
