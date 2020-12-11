import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/router"
import firebase from "firebase/app"
import { useAuthentication } from "../../hooks/authentication"
import Layout from "../../components/Layout"
import { Question } from "../../models/Question"

type Query = {
  id: string
}

export default function QuestionShow() {
  const router = useRouter()
  const query = router.query as Query
  const { user } = useAuthentication()
  const [question, setQuestion] = useState<Question>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(null)

  // 質問取得
  async function loadData() {
    if (query.id === undefined) return

    const questionDoc = await firebase
      .firestore()
      .collection("questions")
      .doc(query.id)
      .get()
    if (!questionDoc.exists) return

    const gotQuestion = questionDoc.data() as Question
    gotQuestion.id = questionDoc.id
    setQuestion(gotQuestion)
  }

  // 質問表示
  useEffect(() => {
    loadData()
  }, [query.id])

  // 回答
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSending(true)

    // データの追加と更新
    // ref: https://qiita.com/star__hoshi/items/64f77c8f4bf15dec318b
    // ref: https://firebase.google.com/docs/firestore/manage-data/transactions?hl=ja
    await firebase.firestore().runTransaction(async (t) => {
      t.set(firebase.firestore().collection("answers").doc(), {
        uid: user.uid,
        questionId: question.id,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

      t.update(firebase.firestore().collection("questions").doc(question.id), {
        isReplied: true
      })
    })

    setIsSending(false)
  }

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {question && (
            <div className="card">
              <div className="card-body">{question.message}</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-4">
        <h2 className="h4">回答する</h2>
        <form onSubmit={onSubmit}>
          <textarea
            name="answer"
            placeholder="回答する"
            rows={6}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="form-control"
            required
          />
          <div className="m-3">
            {isSending ? (
              <div className="spinner-border text-secondary" role="status" />
            ): (
              <button className="btn btn-primary">
                回答する
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )

}
