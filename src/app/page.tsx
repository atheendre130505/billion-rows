import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CodeUploadForm from '@/components/leaderboard/code-upload-form';
import UserStats from '@/components/leaderboard/user-stats';
import LeaderboardTabs from '@/components/leaderboard/leaderboard-tabs';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
