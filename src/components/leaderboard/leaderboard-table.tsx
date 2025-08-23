"use client";

import { useState, useMemo, useEffect } from "react";
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
import { getLeaderboard, type Submission } from "@/lib/db";
import { Skeleton } from "../ui/skeleton";

export default function LeaderboardTable() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: 'executionTime', direction: 'ascending' | 'descending' } | null>({ key: 'executionTime', direction: 'ascending' });

  useEffect(() => {
    const unsubscribe = getLeaderboard((submissions) => {
      setData(submissions);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 self-end" />
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Execution Time (ms)</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                  <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-6 w-32" /></div></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
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
              <TableRow key={submission.id}>
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
