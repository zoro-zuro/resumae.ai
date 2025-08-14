import { FileText } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-8 border-t border-gray-800">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-md flex items-center justify-center shadow-md shadow-purple-500/30">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-wide">
              Resumae.ai
            </span>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-center md:text-right text-sm md:text-base max-w-md">
            Empowering careers with AI-driven resume intelligence.
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-800"></div>

        {/* Done By */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
          <span>
            © {new Date().getFullYear()} Resumae.ai — All rights reserved.
          </span>
          <span>
            Done by{" "}
            <a
              href="https://sheik-portfolio-taupe.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sheik
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
