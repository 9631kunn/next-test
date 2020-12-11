import { useState, useEffect } from "react"
import { Question } from "../../models/Question"
import { useAuthentication } from "../../hooks/authentication"
import firebase from "firebase/app"
import dayjs from 'dayjs'
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
        .orderBy("createdAt", "desc")
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
      <h1 className="h4"></h1>

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {questions.map(question => (
            <div className="card my-3" key={question.id}>
              <div className="card-body">
                <div className="text-truncate">{question.message}</div>
                <div className="text-muted text-right">
                  <small>{dayjs(question.createdAt.toDate()).format("YYYY/MM/DD HH:mm")}</small>
                </div>
              </div>
            </div>
          )) }
        </div>
      </div>
    </Layout>
  )
}
