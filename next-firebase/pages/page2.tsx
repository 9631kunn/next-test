import Link from "next/link"
import { useAuthentication } from "../hooks/authentication"

export default function Home() {
  const { user } = useAuthentication()

  return (
    <div>
      <p>{user?.uid || "未ログイン"}</p>
      <Link href="/">
        <a>GO BACK</a>
      </Link>
    </div>
  )
}
