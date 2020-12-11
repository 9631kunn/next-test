import { useState, useEffect } from "react"
import { Question } from "../../models/Question"
import { useAuthentication } from "../../hooks/authentication"
import firebase from "firebase/app"
import Layout from "../../components/Layout"

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([])
  const { user } = useAuthentication()

  useEffect(() => {
    if (!process.browser) return
    if (user === null) return

    // firebaseのdata取得
    // ref: https://firebase.google.cn/docs/firestore/query-data/get-data?hl=ja
    async function loadQuestions() {
      const snapshot = await firebase
        .firestore()
        .collection("questions")
        .where("receiverUid", "==", user.uid)
        .get()
      if (snapshot.empty) return
      console.log(snapshot)

      const gotQuestions = snapshot.docs.map(doc => {
        const question = doc.data() as Question
        question.id = doc.id
        return question
      })

      setQuestions(gotQuestions)
    }
    loadQuestions()
  }, [process.browser, user])

  return (
    <Layout>
      <div>{ questions.length }</div>
    </Layout>
  )
}
