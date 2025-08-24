"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, Wand } from "lucide-react";
import { analyzeCodeForOptimizations } from "@/ai/flows/analyze-code-for-optimizations";

const formSchema = z.object({
  code: z.string().min(10, {
    message: "Code must be at least 10 characters.",
  }),
});

export default function AiAnalyzer() {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis("");
    try {
      const result = await analyzeCodeForOptimizations({
        code: values.code,
        language: "Java",
      });
      setAnalysis(result.optimizations);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description:
          "There was an error analyzing your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Code Optimizer</CardTitle>
        <CardDescription>
          Paste your Java code below to get optimization suggestions from our AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Java Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="public class ..."
                      className="min-h-[200px] font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Wand />
              )}
              Analyze Code
            </Button>
          </form>
        </Form>

        {analysis && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <div className="mt-2 rounded-md border bg-muted p-4 prose prose-sm max-w-none">
                <pre><code className="language-markdown">{analysis}</code></pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
