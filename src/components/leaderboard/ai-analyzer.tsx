"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeCodeForOptimizations, type AnalyzeCodeOutput } from "@/ai/flows/analyze-code-for-optimizations";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Bot } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  code: z.string().min(50, {
    message: "Code must be at least 50 characters.",
  }),
});

export default function AiAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeCodeForOptimizations({
        code: values.code,
        language: "Java",
      });
      setAnalysisResult(result);
    } catch (e) {
      setError("Failed to analyze code. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Code Optimizer</CardTitle>
              <CardDescription>
                Paste your Java code below to get performance optimization suggestions from our AI assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Java Code</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="public class CalculateAverage_my-username { ... }"
                        className="min-h-[300px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Analyzing..." : "Analyze Code"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {isLoading && (
         <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Bot className="h-6 w-6" />
                <CardTitle>Analysis in Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Analysis Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="p-4 rounded-md bg-muted font-code text-sm overflow-x-auto">
                <code>{analysisResult.optimizations}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
