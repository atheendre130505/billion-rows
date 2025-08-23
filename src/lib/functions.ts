
import { auth } from "./firebase";

export async function triggerTestRunner(filePath: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to run a test.");
  }

  const token = await user.getIdToken();

  const response = await fetch('/api/trigger-test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ filePath }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error triggering test runner:", errorText);
    throw new Error(`Failed to trigger test runner. Status: ${response.status}`);
  }

  return response.json();
}
