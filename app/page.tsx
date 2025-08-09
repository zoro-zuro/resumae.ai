"use client";
import React from "react";
import {
  ArrowRight,
  Upload,
  Search,
  Check,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  LayoutGrid,
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

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[700px] text-gray-600 text-xl mx-auto">
              Choose the plan that accelerates your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>3 resume analyses per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Basic job matching</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Resume score overview</span>
                </li>
              </ul>
              <button className="w-full border-2 border-purple-200 hover:bg-purple-50 text-purple-700 py-3 rounded-lg font-semibold transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-white border-2 border-purple-500 rounded-2xl p-8 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Professional
                </h3>
                <p className="text-gray-600">For serious job seekers</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$19</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited resume analyses</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced AI insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Job description generator</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Detailed improvement reports</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Enterprise
                </h3>
                <p className="text-gray-600">For teams and organizations</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Team collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>White-label options</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <button className="w-full border-2 border-purple-200 hover:bg-purple-50 text-purple-700 py-3 rounded-lg font-semibold transition-colors">
                Contact Sales
              </button>
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
