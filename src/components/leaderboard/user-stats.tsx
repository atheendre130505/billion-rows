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

const MOCK_USER_HISTORY = [
    { id: 1, executionTime: 1452, date: new Date('2024-07-29T11:00:00Z'), status: 'Success' },
    { id: 2, executionTime: 1480, date: new Date('2024-07-28T18:30:00Z'), status: 'Success' },
    { id: 3, executionTime: 0, date: new Date('2024-07-28T15:00:00Z'), status: 'Failed' },
    { id: 4, executionTime: 1550, date: new Date('2024-07-27T10:00:00Z'), status: 'Success' },
];

export default function UserStats() {
    const bestTime = Math.min(...MOCK_USER_HISTORY.filter(s => s.status === 'Success').map(s => s.executionTime));
    
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
                {bestTime.toLocaleString()} <span className="text-lg font-medium text-muted-foreground">ms</span>
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
                        {MOCK_USER_HISTORY.map((sub) => (
                        <TableRow key={sub.id}>
                            <TableCell className="font-mono">{sub.status === 'Success' ? sub.executionTime.toLocaleString() : "N/A"}</TableCell>
                            <TableCell>{sub.date.toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={sub.status === 'Success' ? "default" : "destructive"}>{sub.status}</Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
