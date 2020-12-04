import firebase from "firebase/app"

function authenticate() {

  // 匿名認証
  firebase.auth().signInAnonymously().catch(function (error) {
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

// NOT SSR BUT BROWSER
if (process.browser) {
  authenticate()
}
