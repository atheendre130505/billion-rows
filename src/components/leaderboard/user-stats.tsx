"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { getUserSubmissions, type Submission } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, History, Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function UserStats() {
    const [user] = useAuthState(auth);
    const [history, setHistory] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribe = getUserSubmissions(user.uid, (submissions) => {
                setHistory(submissions);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setHistory([]);
            setLoading(false);
        }
    }, [user]);

    const bestTime = history.length > 0
        ? Math.min(...history.filter(s => s.status === 'Success').map(s => s.executionTime))
        : null;

    if (!user) {
        return (
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Please log in to see your stats.</p>
                </CardContent>
            </Card>
        );
    }
    
    if (loading) {
        return (
             <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Your Stats
                    </CardTitle>
                    <CardDescription>Your personal best and submission history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4" /> Personal Best
                        </h3>
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                            <History className="h-4 w-4" /> Submission History
                        </h3>
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Your Stats
        </CardTitle>
        <CardDescription>Your personal best and submission history.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Star className="h-4 w-4" />
                Personal Best
            </h3>
            <div className="text-4xl font-bold text-primary">
                {bestTime !== null && bestTime !== Infinity ? (
                    <>
                        {bestTime.toLocaleString()} <span className="text-lg font-medium text-muted-foreground">ms</span>
                    </>
                ) : (
                    <span className="text-lg font-medium text-muted-foreground">No successful submissions yet.</span>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <History className="h-4 w-4" />
                Submission History
            </h3>
            <div className="rounded-md border max-h-60 overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time (ms)</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? (
                            history.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-mono">{sub.status === 'Success' ? sub.executionTime.toLocaleString() : "N/A"}</TableCell>
                                <TableCell>{sub.date.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={sub.status === 'Success' ? "default" : "destructive"}>{sub.status}</Badge>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">No submissions yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
