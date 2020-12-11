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
      {user && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <p className="h5">{user.name}さんへの質問</p>
        </div>
      )}
    </Layout>
  )
}
