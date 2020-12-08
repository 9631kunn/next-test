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

    firebase.auth().signInAnonymously().catch((err) => {
      console.log(err)
    })
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: "",
        }
        setUser(loginUser)
        createUserInfoNotFound(loginUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  return {user}
}

async function createUserInfoNotFound(user: User) {
  const userRef = firebase.firestore().collection("users").doc(user.uid)
  const doc = await userRef.get()
  if (doc.exists) {
    return
  }

  await userRef.set({
    name: "taro" + new Date().getTime()
  })
}
