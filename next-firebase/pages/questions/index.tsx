import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Question } from "../../models/Question"
import { useAuthentication } from "../../hooks/authentication"
import firebase from "firebase/app"
import dayjs from 'dayjs'
import Layout from "../../components/Layout"

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPaginationFinished, setIsPagenationFinished] = useState(false)
  const { user } = useAuthentication()
  const scrollContainerRef = useRef(null)

  // firestoreから質問取得
  // ref: https://firebase.google.cn/docs/firestore/query-data/get-data?hl=ja
  function createBaseQuery() {
    return firebase
      .firestore()
      .collection("questions")
      .where("receiverUid", "==", user.uid)
      .orderBy("createdAt", "desc")
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
    if (snapshot.empty) {
      setIsPagenationFinished(true)
      return
    }
    appendQuestions(snapshot)
  }

  // 質問の追加取得
  async function loadNextQuestions() {
    if (questions.length === 0) return

    const lastQuestion = questions[questions.length - 1]
    const snapshot = await createBaseQuery()
      .startAfter(lastQuestion.createdAt)
      .get()

    if (snapshot.empty) return

    appendQuestions(snapshot)
  }

  function onScroll() {
    if (isPaginationFinished) return

    const container = scrollContainerRef.current
    if (container === null) return

    const rect = container.getBoundingClientRect()
    if (rect.top + rect.height > window.innerHeight) return

    loadNextQuestions()
  }

  useEffect(() => {
    if (!process.browser) return
    if (user === null) return
    loadQuestions()

    console.log(scrollContainerRef)
  }, [process.browser, user])

  useEffect(() => {
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [questions, scrollContainerRef.current, isPaginationFinished])

  return (
    <Layout>
      <h1 className="h4"></h1>

      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map(question => (
            <Link href="/questions/[id]" as={`/questions/${question.id}`} key={question.id}>
              <a>
                <div className="card my-3">
                  <div className="card-body">
                    <div className="text-truncate">{question.message}</div>
                    <div className="text-muted text-right">
                      <small>{dayjs(question.createdAt.toDate()).format("YYYY/MM/DD HH:mm")}</small>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )) }
        </div>
      </div>
    </Layout>
  )
}
