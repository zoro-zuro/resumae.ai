"use client";
import { UploadFile } from "@/actions/UploadFile";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CheckCircle, CloudUpload, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";

const UploadResume = () => {
  const { user, isSignedIn } = useUser();
  const canUpload = user && isSignedIn;
  const sensor = useSensors(useSensor(PointerSensor));
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uplodedFileLists, setUploadedFileLists] = useState<string[]>([]);
  const router = useRouter();
  const triggerFileInput = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        alert("You must logged in to upload your resume");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf, .pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
      );

      if (pdfFiles.length === 0) {
        alert("Please upload your resume in pdf formats");
        return;
      }

      setIsUploading(true);
      try {
        const UploadedFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);
          console.log("uploading the file in formData format", formData);
          const result = await UploadFile(formData);
          if (!result.success) {
            throw new Error(`Error uploading resume: ${result.error}`);
          }
          UploadedFiles.push(file.name);
          console.log(result);
        }
        setUploadedFileLists((prev) => [...prev, ...UploadedFiles]);
        setTimeout(() => {
          setUploadedFileLists([]);
        }, 3000);
        router.push("./manage-resume");
        console.log("Process completed");
      } catch (error) {
        console.log("Upload failed:", error);
        alert(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload],
  );
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!user) {
        alert("Sign in to upload resumes");
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center p-4">
        <div
          className="container flex flex-col items-center justify-center p-8 text-center
                      max-w-2xl bg-secondary/30 backdrop-blur-xl rounded-2xl border border-secondary shadow-lg
                      text-foreground"
        >
          <div className="mb-6">
            <Lock className="size-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            To unlock all features and securely upload your resume, please sign
            in to your account.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensor}>
      <div className="flex items-center justify-between gap-8">
        <div className="container flex-1 max-w-full h-[600px] bg-gradient-to-t from-primary/50 to-accent/50 shadow-xl border-2 border-primary rounded-4xl">
          <div
            onDragOver={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
            className={`h-full w-full p-8 ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isUploading ? (
              <div className="h-full flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
                <p className="text-xl font-medium">Uploading ...</p>
              </div>
            ) : (
              <div className="text-muted-foreground h-full w-full flex items-center justify-center flex-col rounded-xl  gap-4">
                <div
                  className={`flex flex-col items-center border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-white shadow-accent shadow-2xl ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-12 text-sm text-gray-600">
                    Drag and drop PDF files here, or click to select files
                  </p>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="application/pdf, .pdf"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button
                    className="mt-4 px-4 py-2  text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canUpload}
                    onClick={triggerFileInput}
                  >
                    Select Files
                  </Button>
                </div>
              </div>
            )}
            {uplodedFileLists.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">Upload files:</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  {uplodedFileLists.map((fileName, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {fileName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="container flex-1 max-w-full h-[600px] bg-white rounded-4xl shadow-xl" />
      </div>
    </DndContext>
  );
};

export default UploadResume;
