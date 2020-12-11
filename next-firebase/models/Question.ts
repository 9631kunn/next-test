import { firestore } from "firebase/app"

export interface Question{
  id: string
  senderUid: string
  receiverUid: string
  message: string
  isReplied: boolean
  createdAt: firestore.Timestamp
}
