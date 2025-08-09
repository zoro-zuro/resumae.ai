import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4  px-8 shadow-md bg-white">
      <Link href="/" className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-1.5 md:gap-3">
          <div className="w-[30px] h-[30px] md:w-9 md:h-9 bg-purple-600 rounded-md flex items-center justify-center">
            <FileText className="h-[16px] w-[16px] md:h-5 md:w-5 text-white" />
          </div>
          <span className="text-md md:text-lg font-semibold">Resumae.ai</span>
        </div>
      </Link>

      {/* Authenticaion */}
      <div className="flex gap-3">
        <SignedIn>
          <Link href="/upload-resume">
            <Button className="cursor-pointer h-[30px] flex gap-1.5 items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
              <span className="hidden md:inline-block">Upload</span>
            </Button>
          </Link>
          <Link href="/manage-resume" className="">
            <Button
              className="cursor-pointer h-[30px] flex gap-1.5 items-center justify-center"
              variant="outline"
            >
              <FileText className="h-5 w-5 text-[#7d78a1]" />
              <span className="hidden md:inline-block">Manage Resume</span>
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button> Get Started</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
