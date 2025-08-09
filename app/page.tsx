"use client";
import React from "react";
import {
  ArrowRight,
  Upload,
  Search,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  Users,
  Mail,
  LayoutGrid,
  FileText,
  CheckSquare,
} from "lucide-react";
import animationData from "@/public/LandingPageAnimation.json";
import Lottie from "lottie-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ResumeLanding() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
        {/* === Middle Layer: Animation === */}
        <div className="absolute inset-0 inset-y-6 z-0 opacity-60 pointer-events-none md:hidden">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* === Front Layer: Content === */}
        <div className="relative z-10 container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-6 max-w-4xl">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Resume Analysis</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                Get Your Dream Job with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {" "}
                  AI Insights
                </span>
              </h1>
              <p className="mx-auto max-w-[800px] text-gray-600 text-lg md:text-xl leading-relaxed">
                Upload your resume, generate tailored job descriptions, and get
                AI-powered analysis to optimize your chances of landing
                interviews. Transform your career with intelligent resume
                enhancement.
              </p>
            </div>

            {/* CTA Buttons */}
            <div>
              <SignedIn>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
                  onClick={() => router.push("/upload-resume")}
                >
                  Start Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center cursor-pointer">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Demo Action Section */}
            <div className="mt-16 w-full max-w-4xl">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Left Content */}
                  <div className="space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Upload & Analyze
                      </h3>
                    </div>

                    <p className="text-gray-600 text-lg text-left">
                      Instantly evaluate your resume with advanced AI to receive
                      actionable feedback:
                    </p>

                    {/* Feature 1 */}
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-medium text-gray-900">
                        ATS Optimization
                      </h4>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-medium text-gray-900">
                        Role-Specific Suggestions
                      </h4>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-center space-x-3">
                      <LayoutGrid className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-medium text-gray-900">
                        Formatting Feedback
                      </h4>
                    </div>

                    {/* Buttons */}
                    <div>
                      <SignedIn>
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
                          onClick={() => router.push("/upload-resume")}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Resume
                        </button>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                          </button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </div>

                  {/* Right-Side Lottie for Desktop */}
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white hidden md:block">
                    <Lottie animationData={animationData} loop={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section className="py-20 md:py-28 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900 mb-4">
              Powerful AI-Driven Features
            </h2>
            <p className="max-w-[700px] text-gray-600 text-xl mx-auto">
              Our intelligent platform transforms how you approach job
              applications and career development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <Target className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Job-Specific Tailoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate sample job descriptions and get personalized
                recommendations to align your resume with specific roles and
                industries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Search className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms analyze your resume for keyword
                optimization, skill gaps, and formatting improvements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Career Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed reports on your resume performance, skill matching
                percentages, and actionable improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-purple-200">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">85%</div>
              <div className="text-purple-200">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2.5x</div>
              <div className="text-purple-200">More Interviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-purple-200">AI Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use — Step-by-step guide */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              How it works — Get your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                resume optimized
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              A few simple steps — upload, scan, and we&apos;ll email the full
              AI report when it&apos;s ready.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1 */}
            <div className="group relative">
              <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0"></div>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 text-white font-bold text-xl mb-6 shadow-lg">
                  1
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    Login / Sign Up
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Create an account or sign in to save reports, manage uploads
                    and receive results by email.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      Secure profiles & saved history
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0"></div>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 text-white font-bold text-xl mb-6 shadow-lg">
                  2
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    Upload & Choose Role
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Upload your resume and type the role you want to match. We
                    can also auto-generate a sample job post using AI.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Upload className="h-5 w-5 text-green-600" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      Upload .pdf / .docx
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0"></div>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xl mb-6 shadow-lg">
                  3
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    Start Scan & Request Email
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Click &ldquo;Start Scan&rdquo; to begin the analysis. Tick
                    the checkbox to get the finished report emailed to you
                    automatically.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      Email me when analysis completes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white font-bold text-xl mb-6 shadow-lg">
                  4
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    Receive Results
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Wait for the email — or revisit your dashboard anytime to
                    see the live results. We&apos;ll also keep the report on
                    your account.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Mail className="h-5 w-5 text-rose-500" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      Secure preview link in email
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto">
            {/* Pro tip card */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">💡</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Pro tip</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Use the &ldquo;Email me&rdquo; option so you don&apos;t have
                    to wait on the site — we&apos;ll send the full report when
                    the analysis completes.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedIn>
                <button
                  onClick={() => router.push("/upload-resume")}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                >
                  <Upload className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Analysis
                </button>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto">
                    <Upload className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start Analysis
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => router.push("/manage-resume")}
                  className="group inline-flex items-center gap-3 border-2 border-gray-200 hover:border-purple-200 px-8 py-4 rounded-xl text-gray-700 hover:text-purple-700 font-semibold transition-all duration-300 hover:shadow-md w-full sm:w-auto bg-white"
                >
                  <span>View dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group inline-flex items-center gap-3 border-2 border-gray-200 hover:border-purple-200 px-8 py-4 rounded-xl text-gray-700 hover:text-purple-700 font-semibold transition-all duration-300 hover:shadow-md w-full sm:w-auto bg-white">
                    <span>View dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-purple-800 via-blue-900 to-indigo-900 text-white">
        <div className="container px-6 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg md:text-xl text-purple-100">
              Join thousands of professionals who’ve accelerated their careers
              with AI-powered resume optimization.
            </p>
            <div className="flex justify-center">
              <div className="">
                <SignedIn>
                  <button
                    className="bg-white text-purple-800 px-6 py-3 rounded-xl font-semibold text-base md:text-lg shadow hover:bg-gray-100 transition"
                    onClick={() => {
                      router.push("/upload-resume");
                    }}
                  >
                    <Upload className="h-5 w-5 mr-2 inline" />
                    Upload Resume Now
                  </button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-white text-purple-800 px-6 py-3 rounded-xl font-semibold text-base md:text-lg shadow hover:bg-gray-100 transition">
                      <Upload className="h-5 w-5 mr-2 inline" />
                      Upload Resume Now
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
