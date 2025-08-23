import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

async function runTest(filePath: string, userId: string): Promise<{ executionTime: number; status: 'Success' | 'Failed' }> {
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
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    if (!idToken) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const { filePath } = await req.json();

        if (!filePath) {
            return new NextResponse(JSON.stringify({ error: 'File path is required.' }), { status: 400 });
        }

        const userRecord = await auth.getUser(decodedToken.uid);
        const username = userRecord.displayName || 'Anonymous';
        const avatarUrl = userRecord.photoURL || `https://i.pravatar.cc/150?u=${decodedToken.uid}`;

        const { executionTime, status } = await runTest(filePath, decodedToken.uid);

        const submission = {
            userId: decodedToken.uid,
            username,
            avatarUrl,
            filePath,
            executionTime,
            status,
            language: 'Java',
            date: new Date(),
        };

        const submissionRef = await db.collection('submissions').add(submission);

        return NextResponse.json({ status: 'success', submissionId: submissionRef.id });

    } catch (error) {
        console.error('Error verifying token or processing file:', error);
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
}
