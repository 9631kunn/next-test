import Head from "next/head"
import Link from "next/link"
import { useAuthentication } from "../hooks/authentication"
import styles from "../styles/Home.module.css"

export default function Home() {

  const { user } = useAuthentication()

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <p>{user?.uid || "未ログイン"}</p>

        <Link href="page2">
          <a>GO TO PAGE2</a>
        </Link>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
