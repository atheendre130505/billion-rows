import { collection, query, orderBy, limit, getDocs, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export type Submission = {
  id?: string;
  rank?: number;
  username: string;
  avatarUrl: string;
  executionTime: number;
  language: "Java";
  date: Date;
  userId: string;
  status: 'Success' | 'Failed';
};

const submissionsCollection = collection(db, "submissions");

export function getLeaderboard(callback: (submissions: Submission[]) => void) {
  const q = query(submissionsCollection, where("status", "==", "Success"), orderBy("executionTime", "asc"), limit(20));
  
  return onSnapshot(q, (querySnapshot) => {
    const submissions: Submission[] = [];
    let rank = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        rank: rank++,
        username: data.username,
        avatarUrl: data.avatarUrl,
        executionTime: data.executionTime,
        language: data.language,
        date: data.date.toDate(),
        userId: data.userId,
        status: data.status,
      });
    });
    callback(submissions);
  });
}

export function getUserSubmissions(userId: string, callback: (submissions: Submission[]) => void) {
  if (!userId) {
    return () => {};
  }
  const q = query(submissionsCollection, where("userId", "==", userId), orderBy("date", "desc"), limit(10));

  return onSnapshot(q, (querySnapshot) => {
    const submissions: Submission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        username: data.username,
        avatarUrl: data.avatarUrl,
        executionTime: data.executionTime,
        language: data.language,
        date: data.date.toDate(),
        userId: data.userId,
        status: data.status,
      });
    });
    callback(submissions);
  });
}
