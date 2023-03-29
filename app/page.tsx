import styles from "./home-page.module.css"
import { NewGame } from "./new-game"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.entry}>
        <h1>Tints & Hints</h1>
        <p>Can you describe a color without using it's name?</p>
        <p>
          What color do you think of when we say <em>grass?</em> Play an online
          game where players join a room and give one and two word clues to
          describe a color.
        </p>
        <NewGame />
      </div>
    </main>
  )
}
