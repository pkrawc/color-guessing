"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function NewGame() {
  const [uuid, setUuid] = useState<null | string>(null)
  useEffect(() => {
    if (!uuid) {
      setUuid(self.crypto.randomUUID())
    }
  }, [])
  return (
    <Link href={`/game/${uuid}`}>
      <button disabled={!uuid}>Start a new game.</button>
    </Link>
  )
}
