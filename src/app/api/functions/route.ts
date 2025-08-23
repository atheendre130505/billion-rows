import { NextResponse } from 'next/server';
import { auth, db, storage } from '@/lib/firebase-admin';
import {HttpsError} from "firebase-functions/v2/https";

// This is a placeholder. In a real scenario, this would
// be a more complex setup to run Java code securely.
async function runTest(filePath: string, userId: string, username: string, avatarUrl: string): Promise<{ executionTime: number; status: 'Success' | 'Failed' }> {
  // Simulate test execution
  console.log(`Running test for ${filePath} by user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5s "test"
  
  const success = Math.random() > 0.2; // 80% success rate
  if (success) {
    const executionTime = 1000 + Math.floor(Math.random() * 1000);
    return { executionTime, status: 'Success' };
  } else {
    return { executionTime: 0, status: 'Failed' };
  }
}

export async function POST(req: Request) {
    const { data } = await req.json();
    const { filePath, userId } = data;

    if (!userId) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    if (!filePath) {
        throw new HttpsError('invalid-argument', 'The function must be called with a "filePath" argument.');
    }

    try {
        const userRecord = await auth.getUser(userId);
        const username = userRecord.displayName || 'Anonymous';
        const avatarUrl = userRecord.photoURL || `https://i.pravatar.cc/150?u=${userId}`;

        const { executionTime, status } = await runTest(filePath, userId, username, avatarUrl);

        const submission = {
            userId,
            username,
            avatarUrl,
            filePath,
            executionTime,
            status,
            language: 'Java',
            date: new Date(),
        };

        await db.collection('submissions').add(submission);

        return NextResponse.json({ status: 'success', submissionId: submission.userId });
    } catch (error) {
        console.error('Error processing file:', error);
        if (error instanceof HttpsError) {
            return new NextResponse(error.message, { status: error.code === 'unauthenticated' ? 401 : 400 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
