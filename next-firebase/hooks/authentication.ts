import firebase from "firebase/app"

import { User } from "../models/User"
import { atom, useRecoilState } from "recoil"

// ref: https://recoiljs.org/docs/basic-tutorial/atoms/

const userState = atom<User>({
  key: "user",
  default: null
})

function authenticate() {
  // 匿名認証
  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
    })

  // ログイン/ログアウト
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.uid)
      console.log(user.isAnonymous)
    } else {
      console.log("SIGNED OUT")
    }
  })
}


function useAuthentication() {
  // ref: https://recoiljs.org/docs/api-reference/core/useRecoilState/
  const [user, setUser] = useRecoilState(userState)
  return {user}
}
