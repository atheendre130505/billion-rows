import { useState, FormEvent } from "react";

export default function SolutionUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOutput("");
    setExecutionTime("");
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      setIsLoading(false);
      return;
    }

    try {
      const codeContent = await file.text();
      const response = await fetch("/api/trigger-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code: codeContent }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An unknown error occurred.");
      } else {
        setOutput(result.output);
        setExecutionTime(result.time);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700"
          >
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Upload Solution File (.java, .py, .c, .cpp)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 shadow-sm sm:text-sm border-gray-300 rounded-md font-mono"
            placeholder="Enter your code here..."
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isLoading ? "Running..." : "Submit"}
          </button>
        </div>
      </form>

      {!isLoading && (output || error || executionTime) && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Result</h3>
          {executionTime && (<div className="mb-2"><span className="font-semibold">Execution Time:</span><span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">{executionTime}s</span></div>)}
          {output && (<div><h4 className="font-semibold text-gray-700">Output:</h4><pre className="mt-1 p-2 bg-gray-900 text-white rounded-md text-sm whitespace-pre-wrap break-all">{output}</pre></div>)}
          {error && (<div className="mt-2"><h4 className="font-semibold text-red-700">Error:</h4><pre className="mt-1 p-2 bg-red-50 text-red-800 rounded-md text-sm whitespace-pre-wrap break-all">{error}</pre></div>)}
        </div>
      )}
    </div>
  );
}
