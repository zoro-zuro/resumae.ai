"use client";
import { generateSampleJobPost } from "@/actions/generateJobPost";
import { triggerScanning } from "@/actions/triggerScanning";
import { updateError } from "@/actions/updateError";
import { UpdateResumePdf } from "@/actions/UpdateResumePdf";
import { UploadFile } from "@/actions/UploadFile";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { SignInButton, useUser } from "@clerk/clerk-react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Bot,
  CheckCircle,
  CloudUpload,
  FileSearchIcon,
  Lock,
  RefreshCwIcon,
} from "lucide-react";
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
  const [textareaValue, setTextAreaValue] = useState("");
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [resumePdfId, setResumePdfId] = useState<Id<"_storage">>();
  const [resumeId, setResumeId] = useState<Id<"resume">>();
  const [isScanning, setIsScanning] = useState(false);
  const [isReplacingFiles, setIsReplacingFiles] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sendMail, setSendMail] = useState(false);
  const router = useRouter();

  const handleGenerateSamplePost = async () => {
    try {
      setIsGeneratingPost(true);

      const response = await generateSampleJobPost(textareaValue || "");

      if (!response.success) {
        console.error("Error:", response.error);
        alert(`Error generating sample job post: ${response.error}`);
        return;
      }

      if (response.data) {
        setTextAreaValue(response.data);
      } else {
        alert("No sample post received from AI.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while generating the sample job post.");
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleClearTextArea = () => setTextAreaValue("");
  const triggerFileInput = useCallback(() => {
    fileRef.current?.click();
    console.log("File input triggered");
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
        alert("You must be logged in to upload your resume");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
      );

      if (pdfFiles.length === 0) {
        alert("Please upload your resume in PDF format");
        return;
      }

      setIsUploading(true);
      try {
        const UploadedFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const result = await UploadFile(formData);
          if (!result.success) {
            throw new Error(`Error uploading resume: ${result.error}`);
          }
          UploadedFiles.push(file.name);
          setResumePdfId(result.data?.fileId as Id<"_storage">);
          setResumeId(result.data?.resumeId as Id<"resume">);
          setPdfUrl(result.data?.pdfUrl || null);
        }

        setUploadedFileLists((prev) => [...prev, ...UploadedFiles]);
      } catch (error) {
        alert(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user],
  );

  const handleReupload = useCallback(
    async (files: FileList) => {
      console.log("Reuploading files", files);
      if (!user) {
        alert("You must be logged in to upload your resume");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
      );

      if (pdfFiles.length === 0) {
        alert("Please upload your resume in PDF format");
        return;
      }
      setIsUploading(true);
      try {
        const UploadedFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const result = await UpdateResumePdf(
            resumePdfId as Id<"_storage">,
            resumeId as Id<"resume">,
            formData,
          );
          if (!result.success) {
            throw new Error(`Error uploading resume: ${result.error}`);
          }
          UploadedFiles.push(file.name);
          setResumePdfId(result.data?.fileId as Id<"_storage">);
          setResumeId(result.data?.resumeId as Id<"resume">);
          setPdfUrl(result.data?.pdfUrl || null);
        }

        setUploadedFileLists(UploadedFiles);
        setIsReplacingFiles(false); // <-- Reset after reupload
        if (fileRef.current) fileRef.current.value = ""; // <-- Reset input value
      } catch (error) {
        alert(
          `Reupload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [user, resumeId, resumePdfId],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("File input changed", e.target.files);
      if (isReplacingFiles) {
        if (e.target.files?.length) {
          handleReupload(e.target.files);
        }
      } else {
        if (e.target.files?.length) {
          handleUpload(e.target.files);
        }
      }
    },
    [handleUpload, isReplacingFiles, handleReupload],
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

  const handleTriggerScanning = useCallback(async () => {
    if (!user) {
      alert("Authentication failed");
      throw new Error("Authentication failed");
    }
    if (!resumePdfId) {
      alert("Please upload resume pdf before triggering the scan");
    }

    setIsScanning(true);
    try {
      const result = await triggerScanning(
        resumeId,
        resumePdfId,
        textareaValue,
        sendMail,
      );
      if (result.error) {
        alert(`Error in scanning the resume with job post ${result.error}`);
        throw new Error("Error in scanning the resume with job post ");
      }
      if (result.data) {
        console.log(result.data);
      }
    } catch (error) {
      alert(`Error triggering scanning the resume ${error}`);
      await updateError(resumeId as Id<"resume">);
      throw new Error("Error triggering the resume scan");
    } finally {
      setIsScanning(false);
      router.push(`/resume/${resumeId}`);
    }
  }, [user, resumePdfId, textareaValue, router, resumeId, sendMail]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border shadow-xl text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to securely upload your resume and access all
            features.
          </p>
          <SignInButton mode="modal">
            <Button className="w-full">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensor}>
      <div className="flex gap-6 flex-wrap justify-center p-6">
        {/* Upload Section */}
        <div className="w-full max-w-[480px] h-[600px] bg-white rounded-3xl shadow-lg border border-gray-200 p-6 relative">
          <div
            onDragOver={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
            className={`h-full w-full flex flex-col items-center justify-center gap-4 transition-all rounded-xl border-2 border-dashed ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50 "} }`}
          >
            <input
              type="file"
              ref={fileRef}
              accept="application/pdf, .pdf"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                <p className="text-gray-700 font-medium">Uploading...</p>
              </div>
            ) : pdfUrl ? (
              <>
                <div
                  className=" rounded-lg w-full overflow-auto"
                  style={{ height: "100%" }}
                >
                  <iframe
                    src={`${pdfUrl}#page=1`}
                    className="w-full h-full rounded-xl border-0"
                    title="Resume Preview"
                    style={{ backgroundColor: "white" }}
                  />
                </div>

                <Button
                  className="absolute inset-0 mt-0.5 mx-auto w-fit border-dashed border-white rounded-full"
                  onClick={() => {
                    if (resumePdfId) {
                      setIsReplacingFiles(true);
                      triggerFileInput();
                      console.log("Reuploading file...");
                    }
                  }}
                  disabled={!canUpload}
                >
                  <RefreshCwIcon size={5} stroke="white" />
                </Button>
              </>
            ) : (
              <>
                <CloudUpload className="w-12 h-12 text-primary" />
                <p className="text-center text-sm text-gray-600">
                  Drag and drop PDF files here, or click to select files
                </p>

                <Button onClick={triggerFileInput} disabled={!canUpload}>
                  Select Files
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tailoring Section */}
        <div className="w-full max-w-[580px] h-[600px] bg-white rounded-3xl shadow-lg border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FileSearchIcon className="text-primary" size={32} />
            <h2 className="text-xl font-semibold">Resume Tailoring</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Paste <strong>the job you’re applying for</strong> and get a
            job-specific resume improvement report.
          </p>

          <div className="flex flex-col bg-gray-50 rounded-lg border border-gray-300 p-4 h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-800 font-medium">
                Get a job-specific report
              </span>
              <Button variant="outline" size="sm" onClick={handleClearTextArea}>
                Clear
              </Button>
            </div>
            <textarea
              value={textareaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              placeholder="Paste job description here..."
              className="resize-none w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <div className="mt-2 text-right">
              <Button
                variant="link"
                className="text-sm px-2"
                onClick={() => {
                  handleGenerateSamplePost();
                }}
                disabled={isUploading || isScanning}
              >
                <Bot className="w-4 h-4 mr-1" />
                {isGeneratingPost
                  ? "Generating..."
                  : "Generate Sample Job Post"}
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col gap-2.5 md:justify-between md:flex-row flex-wrap w-full mt-2 py-4">
            <div className="flex gap-1.5 items-center justify-center md:items-center md:justify-center">
              <input
                type="checkbox"
                name="mail"
                id=""
                checked={sendMail}
                onChange={(e) => {
                  setSendMail(e.target.checked);
                  console.log(e.target.checked);
                }}
                className="cursor-pointer w-4 h-4 md:w-5 md:h-5 rounded-sm accent-primary m-1"
              />
              <span className="text-gray-600 text-[12px] md:text-sm font-medium w-full">
                Send mail after completion <b>(Suggested)</b>
              </span>
            </div>
            <Button
              className={`${isScanning || !resumeId || !resumePdfId ? "cursor-not-allowed" : ""} `}
              onClick={() => {
                handleTriggerScanning();
                router.push("/manage-resume");
              }}
              disabled={!resumePdfId || !resumeId || isUploading || isScanning}
            >
              {!isScanning ? "Start Scanning" : "Scanning ..."}
            </Button>
          </div>

          {uplodedFileLists.length > 0 && (
            <div className="w-full mt-4">
              <h4 className="font-semibold text-sm mb-2">Uploaded Files:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                {uplodedFileLists.map((fileName, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default UploadResume;
