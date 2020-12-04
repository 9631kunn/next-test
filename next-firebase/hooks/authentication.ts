import firebase from "firebase/app"

import { User } from "../models/User"
import { atom, useRecoilState } from "recoil"
import { useEffect } from "react"

// ref: https://recoiljs.org/docs/basic-tutorial/atoms/
const userState = atom<User>({
  key: "user",
  default: null
})

export function useAuthentication() {
  // ref: https://recoiljs.org/docs/api-reference/core/useRecoilState/
  const [user, setUser] = useRecoilState(userState)


  useEffect(() => {
    if (user !== null) {
      return
    }

    console.log("START USEEFFECT")

    firebase.auth().signInAnonymously().catch((err) => {
      console.log(err)
    })
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("SET USER")
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  return {user}
}
