import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardTable from "./leaderboard-table";
import AiAnalyzer from "./ai-analyzer";
import { Trophy, Sparkles } from "lucide-react";

export default function LeaderboardTabs() {
    return (
        <Tabs defaultValue="leaderboard">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard">
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                </TabsTrigger>
                <TabsTrigger value="ai-analyzer">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Code Analyzer
                </TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard" className="mt-6">
                <LeaderboardTable />
            </TabsContent>
            <TabsContent value="ai-analyzer" className="mt-6">
                <AiAnalyzer />
            </TabsContent>
        </Tabs>
    )
}
