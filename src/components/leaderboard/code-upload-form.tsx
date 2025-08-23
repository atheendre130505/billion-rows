"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { triggerTestRunner } from "@/lib/functions";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CodeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "testing" | "error" | "success">("idle");
  const { toast } = useToast();
  const [user] = useAuthState(auth);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .java file.",
        variant: "destructive",
      });
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/x-java-source": [".java"] },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to submit.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Not authenticated", description: "Please log in to submit your code.", variant: "destructive" });
      return;
    }

    setStatus("uploading");
    const filePath = `submissions/${user.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed:", error);
        setStatus("error");
        toast({ title: "Upload Failed", description: "There was an error uploading your file.", variant: "destructive" });
      },
      async () => {
        setStatus("testing");
        try {
          await triggerTestRunner(filePath);
          setStatus("success");
          toast({ title: "Submission Successful!", description: "Your code is being tested and will appear on the leaderboard." });
          setFile(null);
          setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
          setStatus("error");
          toast({ title: "Submission Failed", description: "The testing process could not be started.", variant: "destructive" });
          console.error(error)
          setTimeout(() => setStatus("idle"), 5000);
        }
      }
    );
  };
  
  const getStatusMessage = () => {
    switch (status) {
      case "uploading": return "Uploading your file...";
      case "testing": return "Testing your code against the dataset...";
      case "error": return "An error occurred. Please try again.";
      case "success": return "Your submission was successful!";
      default: return "Awaiting submission...";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
        <CardDescription>
          Drag and drop your .java file or click to select a file. You must be logged in.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {file ? (
            <div className="flex items-center justify-between p-4 border rounded-md bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} disabled={status !== 'idle'}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag 'n' drop a .java file here, or click to select"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit" size="lg" disabled={!file || status !== 'idle' || !user}>
            <span className="text-accent-foreground">Submit for Testing</span>
          </Button>
          {status !== 'idle' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>{getStatusMessage()}</span>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
