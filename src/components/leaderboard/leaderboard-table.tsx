"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Submission = {
  rank: number;
  username: string;
  avatarUrl: string;
  executionTime: number;
  language: "Java";
  date: Date;
};

const MOCK_DATA: Submission[] = [
  { rank: 1, username: 'PerfWizard', avatarUrl: 'https://i.pravatar.cc/150?u=a1', executionTime: 1250, language: 'Java', date: new Date('2024-07-28T10:00:00Z') },
  { rank: 2, username: 'CodeNinja', avatarUrl: 'https://i.pravatar.cc/150?u=a2', executionTime: 1305, language: 'Java', date: new Date('2024-07-27T15:30:00Z') },
  { rank: 3, username: 'DataCruncher', avatarUrl: 'https://i.pravatar.cc/150?u=a3', executionTime: 1320, language: 'Java', date: new Date('2024-07-29T09:00:00Z') },
  { rank: 4, username: 'ByteBlaster', avatarUrl: 'https://i.pravatar.cc/150?u=a4', executionTime: 1400, language: 'Java', date: new Date('2024-07-26T11:45:00Z') },
  { rank: 5, username: 'AlgoQueen', avatarUrl: 'https://i.pravatar.cc/150?u=a5', executionTime: 1452, language: 'Java', date: new Date('2024-07-29T11:00:00Z') },
  { rank: 6, username: 'JavaGuru', avatarUrl: 'https://i.pravatar.cc/150?u=a6', executionTime: 1510, language: 'Java', date: new Date('2024-07-25T18:00:00Z') },
  { rank: 7, username: 'SpeedDemon', avatarUrl: 'https://i.pravatar.cc/150?u=a7', executionTime: 1515, language: 'Java', date: new Date('2024-07-28T14:20:00Z') },
];

export default function LeaderboardTable() {
  const [data, setData] = useState<Submission[]>(MOCK_DATA);
  const [sortConfig, setSortConfig] = useState<{ key: 'executionTime', direction: 'ascending' | 'descending' } | null>({ key: 'executionTime', direction: 'ascending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems.map((item, index) => ({...item, rank: index + 1}));
  }, [data, sortConfig]);

  const requestSort = (key: 'executionTime') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: 'executionTime') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <Select defaultValue="java" disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('executionTime')}>
                    Execution Time (ms)
                    {getSortIcon('executionTime')}
                </Button>
              </TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((submission) => (
              <TableRow key={submission.username}>
                <TableCell className="text-center font-bold text-lg">{submission.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={submission.avatarUrl} alt={submission.username} />
                      <AvatarFallback>{submission.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{submission.username}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{submission.executionTime.toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary">{submission.language}</Badge></TableCell>
                <TableCell>{submission.date.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
