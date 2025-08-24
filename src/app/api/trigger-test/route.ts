import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { admin } from '@/lib/firebase-admin';

// ** IMPORTANT: Replace with your actual Cloud Run Service URL after deployment **
// You can find this URL in the Cloud Run service details in the Google Cloud Console
// or in the output of the `gcloud run deploy` command.
const CLOUD_RUN_URL = 'https://code-execution-service-710657708781.us-central1.run.app';

// Use GoogleAuth to get an identity token for the Cloud Run service
// This ensures that only your authenticated Firebase Function can call the Cloud Run service.
// The identity token is automatically handled by the library in server environments.
const googleAuth = new GoogleAuth();

export async function POST(req: Request) {
  try {
    // 1. Get filePath from the request body
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json({ error: 'filePath is required.' }, { status: 400 });
    }

    // 2. Download the file from Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    const [fileContent] = await file.download();

    // 3. Extract the language from the file extension
    const fileExtension = filePath.split('.').pop();
    const language = fileExtension || 'unknown'; // Default to 'unknown' if no extension

    // 4. Get an authenticated client for the Cloud Run service and send the code
    const client = await googleAuth.getIdTokenClient(CLOUD_RUN_URL);
    const response = await client.request({
      url: CLOUD_RUN_URL,
      method: 'POST',
      data: { language, code: fileContent.toString('base64') },
      responseType: 'json',
    });

    // 5. Return the response from the Cloud Run service
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Error calling Cloud Run service:', error);
    // Return an error response
    return NextResponse.json({ error: 'Failed to execute code', details: error.message }, { status: error.response?.status || 500 });
  }

}
