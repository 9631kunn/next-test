import { useState, useEffect } from "react"
import { Question } from "../../models/Question"
import { useAuthentication } from "../../hooks/authentication"
import firebase from "firebase/app"
import dayjs from 'dayjs'
import Layout from "../../components/Layout"

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([])
  const { user } = useAuthentication()

  // firestoreから質問取得
  // ref: https://firebase.google.cn/docs/firestore/query-data/get-data?hl=ja
  function createBaseQuery() {
    return firebase
      .firestore()
      .collection("questions")
      .where("receiverUid", "==", user.uid)
      .orderBy("createdAt", desc)
      .limit(10)
  }

  // questionsに取得した質問をsetQuestions
  function appendQuestions(
    snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) {
    const gotQuestions = snapshot.docs.map(doc => {
      const question = doc.data() as Question
      question.id = doc.id
      return question
    })
    setQuestions(questions.concat(gotQuestions))
  }

  // 質問取得〜状態管理
  async function loadQuestions() {
    const snapshot = await createBaseQuery().get()
    if (snapshot.empty) return
    appendQuestions(snapshot)
  }

  useEffect(() => {
    if (!process.browser) return
    if (user === null) return
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
