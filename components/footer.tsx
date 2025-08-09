import { FileText } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-6 ">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-md flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Resumae.ai</span>
          </div>
          <p className="text-gray-400 text-center md:text-right text-sm md:text-base">
            Empowering careers with AI-driven resume intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
