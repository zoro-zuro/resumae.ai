"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Lock, FileText, Calendar, HardDrive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

const ManageResume = () => {
  const { user } = useUser();
  const resumeList = useQuery(api.resume.getAllResume, {
    userId: user?.id as string,
  });
  const router = useRouter();

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

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status badge variant and color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "uploaded":
      case "completed":
      case "success":
        return (
          <Badge
            variant="default"
            className="bg-green-500 text-white border-green-500 hover:bg-green-600"
          >
            {status}
          </Badge>
        );
      case "processing":
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          >
            {status}
          </Badge>
        );
      case "failed":
      case "error":
        return <Badge variant="destructive">{status}</Badge>;
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="container max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Management
          </h1>
          <p className="text-gray-600">
            Manage and track your uploaded resumes
          </p>
        </div>

        {/* Table Container with Shadow */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <Table>
              <TableCaption className="text-gray-500 pb-4">
                A list of your recent resume uploads and their current status.
              </TableCaption>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      File Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      Size
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Uploaded
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumeList && resumeList.length > 0 ? (
                  resumeList.map((resume) => (
                    <TableRow
                      key={resume._id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 truncate max-w-48">
                              {resume.fileName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {resume.fileId.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(resume.status)}</TableCell>
                      <TableCell className="text-gray-600">
                        {formatFileSize(resume.size)}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                          {resume.mimeType.split("/")[1]?.toUpperCase() ||
                            "FILE"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(resume.uploadedAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="hover:cursor-pointer"
                          onClick={() => {
                            router.push(`/resume/${resume._id}`);
                          }}
                        >
                          Veiw
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-500">
                          <div className="font-medium">No resumes found</div>
                          <div className="text-sm">
                            Upload your first resume to get started
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary Cards */}
        {resumeList && resumeList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {resumeList.length}
              </div>
              <div className="text-gray-600 text-sm">Total Resumes</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {
                  resumeList.filter(
                    (r) =>
                      r.status.toLowerCase() === "uploaded" ||
                      r.status.toLowerCase() === "completed",
                  ).length
                }
              </div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  resumeList.filter(
                    (r) =>
                      r.status.toLowerCase() === "processing" ||
                      r.status.toLowerCase() === "pending",
                  ).length
                }
              </div>
              <div className="text-gray-600 text-sm">Processing</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="text-2xl font-bold text-red-600">
                {
                  resumeList.filter(
                    (r) =>
                      r.status.toLowerCase() === "error" ||
                      r.status.toLowerCase() === "failed",
                  ).length
                }
              </div>
              <div className="text-gray-600 text-sm">Failed</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResume;
