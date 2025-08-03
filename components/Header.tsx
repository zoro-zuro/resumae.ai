import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4  px-8 shadow-md bg-white">
      <Link href="/">
        <Image
          src="/logo.jpg"
          alt="Resumae.ai"
          width={100}
          height={35}
          className="object-fill"
        />
      </Link>

      {/* Authenticaion */}
      <div className="flex gap-3">
        <SignedIn>
          <Link href="/upload-resume">
            <Button className="cursor-pointer h-[30px]">Upload</Button>
          </Link>
          <Link href="/manage-resume">
            <Button className="cursor-pointer h-[30px]" variant="outline">
              Manage Resume
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button> Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
