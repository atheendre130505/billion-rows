'use server';
/**
 * @fileOverview An AI agent that analyzes code and suggests optimizations.
 *
 * - analyzeCodeForOptimizations - A function that handles the code analysis process.
 * - AnalyzeCodeInput - The input type for the analyzeCodeForOptimizations function.
 * - AnalyzeCodeOutput - The return type for the analyzeCodeForOptimizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code to analyze, as a string.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  optimizations: z.string().describe('Suggested optimizations for the code.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCodeForOptimizations(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeForOptimizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are an expert code optimizer. You will analyze the provided code and suggest potential optimizations to improve its execution time.

  Language: {{{language}}}

  Code:
  {{{
    code
  }}}

  Please provide a detailed explanation of each optimization suggestion, including why it would improve performance.`,
});

const analyzeCodeForOptimizationsFlow = ai.defineFlow(
  {
    name: 'analyzeCodeForOptimizationsFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
