import { firestore } from 'firebase-admin';

//인터페이스 기본
interface MessageBase {
  id: string;
  /** 사용자가 남긴 질문 */
  message: string;

  /** 댓글 */
  reply?: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
  /** 비공개처리여부 deny */
  deny?: boolean;
}

export interface InMessage extends MessageBase {
  createAt: string;
  replyAt?: string;
}

/**get 할 때 쓰는 인터페이서(서버사이드) */
export interface InMessageServer extends MessageBase {
  /** Timestamp : 파이어베이스의 FieldValue */
  createAt: firestore.Timestamp;
  replyAt?: firestore.Timestamp;
}
