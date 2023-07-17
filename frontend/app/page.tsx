"use client";

import { useAuth } from "@pangeacyber/react-auth";
import Link from "next/link";

export default function Home() {
  const { authenticated } = useAuth();

  return (
    <main className="w-full h-full p-0 box-border flex flex-col text-base">
      <div>
        <div className="px-4 py-5 rounded-var bg-trans-black/0 border-1 border-trans-var(--card-border-rgb)/0">

          {authenticated && <p>Please navigate to the  <Link href={"/chat"}>Secure ChatGPT</Link></p>}
          {!authenticated && <p>Please sign in to see the chat page.</p>}
        </div>
      </div>
    </main>
  );
}
