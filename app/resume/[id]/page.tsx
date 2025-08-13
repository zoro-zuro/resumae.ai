"use client";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Calendar,
  Activity,
  Award,
  Clock,
  BarChart3,
  Users,
  Shield,
  OctagonAlert,
  Lock,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { triggerDeleteResume } from "@/actions/deleteResume";
import Lottie from "lottie-react";
import animationData from "@/public/ResumePageAnimation.json";
import { SignInButton, useUser } from "@clerk/clerk-react";
const ResumePage = () => {
  const params = useParams<{ id: Id<"resume"> }>();
  const [tab, setTab] = useState("analytics");
  const router = useRouter();
  const resume = useQuery(api.resume.getResumeById, {
    resumeId: params.id,
  });
  const pdfUrl = useQuery(api.resume.generateDownloadUrl, {
    resumeId: resume?.fileId as Id<"_storage">,
  });
  const isLoading = !resume;

  const { user } = useUser();

  const isAllowed = user?.id == resume?.userId;

  const handleDeleteResume = useCallback(async () => {
    router.push("/manage-resume");
    try {
      if (!resume?._id) {
        console.error("No resume ID found");
        return;
      }
      const response = await triggerDeleteResume(resume._id);
      if (response?.success) {
        console.log(response.message);
      }
      if (response?.error) {
        console.error(response.error);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      return;
    }
  }, [resume?._id, router]);

  if (isLoading || !resume) {
    return (
      <div className="flex items-center justify-center h-screen mx-8">
        <Lottie
          className="animation rounded-2xl"
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
          // Optional: Control playback
          // speed={1}
          // direction={1}
        />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-emerald-600";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-amber-600";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  const tabs = [
    { id: "analytics", label: "Analytics Overview", icon: BarChart3 },
    { id: "experience", label: "Experience Analysis", icon: Users },
    { id: "skills", label: "Skills Assessment", icon: Shield },
    { id: "warnings", label: "Recommendations", icon: AlertTriangle },
    { id: "aisummary", label: "AI Insights", icon: Brain },
    { id: "resume", label: "Resume Preview", icon: FileText },
  ];
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
  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border shadow-xl text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6">
            You are not the owner of the resume
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-bl from-primary/40 to-accent/60 rounded-xl backdrop:blur-2xl p-5 md:p-6 mx-4 md:mx-8 mb-6 mt-4 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto sm:px-3 lg:px-8">
        {/* Header */}
        <div className="flex min-w-full flex-col container items-end justify-center">
          <div className=" items-center space-x-3 md:hidden flex">
            <Badge
              className={` ${resume.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} px-3 py-1 border-b-0 rounded-b-none`}
            >
              {resume.status === "completed" && (
                <>
                  <Activity className="h-4 w-4 mr-1" />
                  Analysis Complete
                </>
              )}
              {resume.status === "processing" && (
                <>
                  <Clock className="h-4 w-4 mr-1" />
                  In Progress
                </>
              )}
              {resume.status === "failed" && (
                <>
                  <OctagonAlert className="h-4 w-4 mr-1" />
                  Failed
                </>
              )}
            </Badge>
          </div>
          <div className="bg-white w-full rounded-xl rounded-tr-none md:rounded-tr-2xl shadow-sm border border-gray-200 mb-6 p-6">
            <div className="flex items-center justify-between container">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-none md:bg-gradient-to-br md:from-blue-500 md:to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-full w-full md:h-6 md:w-6 text-white md:stroke-white stroke-primary" />
                </div>
                <div>
                  <h1 className="text-md md:text-2xl font-bold text-gray-900">
                    {resume.role}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Uploaded:{" "}
                        {new Date(
                          resume.uploadedAt as number,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" md:items-center md:space-x-3 hidden md:flex">
                <Badge
                  className={` ${resume.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} px-3 py-1`}
                >
                  {resume.status === "completed" && (
                    <>
                      <Activity className="h-4 w-4 mr-1" />
                      Analysis Complete
                    </>
                  )}
                  {resume.status === "processing" && (
                    <>
                      <Clock className="h-4 w-4 mr-1" />
                      In Progress
                    </>
                  )}
                  {resume.status === "error" && (
                    <>
                      <OctagonAlert className="h-4 w-4 mr-1" />
                      Error
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-80 space-y-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Analysis Sections
              </h2>
              <nav className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      tab === id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:flex-1">
            {tab === "analytics" && (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card
                  className={`${getScoreBackground(resume.resumeScore)} border-2`}
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="flex flex-col md:flex-row items-center justify-center space-x-3 mb-4">
                        <Award
                          className={`h-8 w-8 ${getScoreColor(resume.resumeScore)}`}
                        />
                        <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                          Overall Resume Score
                        </h2>
                      </div>
                      <div
                        className={`text-3xl md:text-6xl font-bold ${getScoreColor(resume.resumeScore)} mb-4`}
                      >
                        {resume.resumeScore}%
                      </div>
                      <div className="max-w-md mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2 md:h-4 mb-4">
                          <div
                            className={`h-2 md:h-4 rounded-full transition-all duration-1000 ${getProgressBarColor(resume.resumeScore)}`}
                            style={{ width: `${resume.resumeScore}%` }}
                          />
                        </div>
                        <p className="text-gray-600 font-medium">
                          {resume.resumeScore >= 80
                            ? "Excellent Match"
                            : resume.resumeScore >= 60
                              ? "Good Potential"
                              : "Needs Improvement"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <Card className="bg-white border border-gray-200 shadow-sm mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Keyword Match
                          </h3>
                        </div>
                        <span
                          className={`text-2xl font-bold ${getScoreColor(resume.keywordDensity)}`}
                        >
                          {resume.keywordDensity}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 md:h-3 rounded-full transition-all duration-700"
                          style={{ width: `${resume.keywordDensity}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Resume keywords align well with job requirements
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200 shadow-sm mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Skills Match
                          </h3>
                        </div>
                        <span
                          className={`text-2xl font-bold ${getScoreColor(resume.skillsMatch)}`}
                        >
                          {resume.skillsMatch}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 md:h-3 rounded-full transition-all duration-700"
                          style={{ width: `${resume.skillsMatch}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Strong technical skills alignment with role requirements
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {tab === "experience" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${resume.experienceMatch ? "bg-emerald-50" : "bg-red-50"}`}
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${resume.experienceMatch ? "text-emerald-600" : "text-red-500"}`}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Experience Analysis
                      </h3>
                    </div>
                    <Badge
                      className={`mb-4 ${resume.experienceMatch ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                      {resume.experienceMatch
                        ? "Requirements Met"
                        : "Gap Identified"}
                    </Badge>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {resume.experienceGap}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Suggested Keywords
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resume.keywordSuggestions.map((keyword) => (
                        <Badge
                          key={keyword}
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Consider incorporating these terms to improve keyword
                      matching
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col items-end w-full">
                  <Badge className="bg-emerald-100 text-emerald-800 text-sm rounded-b-none border-b-0 md:border-b md:hidden">
                    {resume.matchedSkills.length} skills
                  </Badge>
                  <Card className="w-full bg-emerald-50 border-emerald-200 shadow-sm rounded-tr-none md:rounded-2xl">
                    <CardContent className="p-6 pt-0 md:pt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Matched Skills
                        </h3>
                        <Badge className="bg-emerald-100 text-emerald-800 text-sm hidden md:inline-block">
                          {resume.matchedSkills.length} skills
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resume.matchedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-emerald-100 text-emerald-800 border-emerald-300 leading-snug whitespace-normal break-words"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col items-end w-full ">
                  <Badge className="bg-red-100 text-red-800 text-sm rounded-b-none border-b-0 md:border-b md:hidden">
                    {resume.missingSkills.length} skills
                  </Badge>
                  <Card className="w-full bg-red-50 border-red-200 shadow-sm rounded-tr-none md:rounded-2xl">
                    <CardContent className="p-6 pt-0 md:pt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Skills to Develop
                        </h3>
                        <Badge className="bg-red-100 text-red-800 text-sm hidden md:inline-block">
                          {resume.missingSkills.length} skills
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 grow">
                        {resume.missingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-red-100 text-red-800 border-red-300 whitespace-normal break-words px-2 py-1 text-sm leading-snug"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {tab === "warnings" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-amber-50 border-amber-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Areas for Improvement
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      {resume.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="h-2 w-2 bg-amber-500 rounded-full mt-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {warning}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recommendations
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      {resume.recommendations.map((recommendation, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {recommendation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === "aisummary" && (
              <Card className="bg-purple-50 border-purple-200 shadow-sm w-full">
                <CardContent className="p-4 md:p-8 w-full">
                  <div className="flex items-center space-x-3 mb-6 w-full">
                    <div className="h-12 w-12 md:bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="w-full">
                      <h3 className="text-md md:text-lg font-semibold md:font-bold text-gray-900">
                        AI Analysis Summary
                      </h3>
                      <p className="text-purple-700 text-sm hidden md:inline-block">
                        Comprehensive evaluation powered by advanced AI
                      </p>
                    </div>
                  </div>
                  <div className="prose text-left prose-sm max-w-none px-2 md:px-0">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {resume.aisummary}
                    </p>
                  </div>
                  <p className="text-purple-700 text-sm  md:hidden mt-2">
                    Comprehensive evaluation powered by advanced AI
                  </p>
                </CardContent>
              </Card>
            )}

            {tab === "resume" && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Resume Preview
                    </h3>
                  </div>

                  {/* PDF Viewer */}
                  <div
                    className="bg-gray-100 rounded-lg p-0 md:p-4 mb-4 w-full overflow-auto"
                    style={{ height: "400px" }}
                  >
                    <iframe
                      src={`${pdfUrl}#page=1&view=full&zoom=40`}
                      className="w-full h-full rounded border-0"
                      title="Resume Preview"
                      style={{ backgroundColor: "white" }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="w-full flex items-center justify-end mt-5">
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDeleteResume()}
          >
            Delete Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
