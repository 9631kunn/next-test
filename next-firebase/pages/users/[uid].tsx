import { useEffect, useState } from "react"
import { User } from "../../models/User"
import { useRouter } from "next/router"
import firebase from "firebase/app"
import Layout from '../../components/Layout'

type Query = {
  uid: string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null)
  const router = useRouter()
  const query = router.query as Query

  useEffect(() => {
    async function loadUser() {
      const doc = await firebase.firestore().collection("users").doc(query.uid).get()

      if (!doc.exists) {
        return
      }

      const gotUser = doc.data() as User
      gotUser.uid = doc.id
      setUser(gotUser)
    }
    loadUser()
  }, [query.uid])

  return (
    <Layout>
      <div>{user ? user.name : 'ロード中…'}</div>
      <button className="btn btn-primary">ボタン</button>
    </Layout>
  )
}
