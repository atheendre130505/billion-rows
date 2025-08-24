import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

import { NextResponse } from 'next/server';

// ** IMPORTANT: Replace with your actual Cloud Run Service URL after deployment **
// You can find this URL in the Cloud Run service details in the Google Cloud Console
// or in the output of the `gcloud run deploy` command.
const CLOUD_RUN_URL = 'YOUR_CLOUD_RUN_URL_HERE';

// Use GoogleAuth to get an identity token for the Cloud Run service
// This ensures that only your authenticated Firebase Function can call the Cloud Run service.
// The identity token is automatically handled by the library in server environments.
const googleAuth = new GoogleAuth();

export async function POST(req: Request) {
  // Check if the Cloud Run URL placeholder has been replaced
  if (CLOUD_RUN_URL === 'YOUR_CLOUD_RUN_URL_HERE') {
    console.error('CLOUD_RUN_URL has not been set in src/app/api/trigger-test/route.ts');
    return NextResponse.json(
      { error: 'Server not configured: Cloud Run URL is missing.' },
      { status: 500 }
    );
  }

  try {
    // 1. Get language and code from the request body
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required.' }, { status: 400 });
    }

    // 2. Base64 encode the code
    const encodedCode = Buffer.from(code).toString('base64');

    // 3. Get an authenticated client for the Cloud Run service
    const client = await googleAuth.getIdTokenClient(CLOUD_RUN_URL);

    // 4. Send the code to the Cloud Run service
    const response = await client.request({
      url: CLOUD_RUN_URL,
      method: 'POST',
      data: { language, code: encodedCode },
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
