import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CodeUploadForm from '@/components/leaderboard/code-upload-form';
import UserStats from '@/components/leaderboard/user-stats';
import LeaderboardTabs from '@/components/leaderboard/leaderboard-tabs';
import { min } from 'date-fns';
import { format } from 'path';

export default function Home() {
  const formatString = "{Station1=min/mean/max, Station2=min/mean/max, ...}";
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold">How to Participate</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>The goal is to process a large text file of weather station measurements and calculate the min, mean, and max temperature for each station.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <span className="font-semibold text-foreground">Input:</span> Your program must read all its input from Standard Input (`System.in`). The dataset will be piped to your program automatically.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Output:</span> Your program must write its results to Standard Output (`System.out`).
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Format:</span> The output must be a single string with stations sorted alphabetically, in the format: <code>{formatString}</code>.
      </li>
                  <li>
                    <span className="font-semibold text-foreground">File:</span> Drag and drop your `.java` source file into the upload area below.
                  </li>
                </ol>
              </div>
            </div>
            <CodeUploadForm />
            <LeaderboardTabs />
          </div>
          <div className="lg:col-span-1">
            <UserStats />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
