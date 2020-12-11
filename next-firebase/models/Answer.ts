import { firestore } from "firebase/app"

export interface Answer {
  id: string
  uid: string
  questionId: string
  message: string
  createdAt: firestore.Timestamp
}
