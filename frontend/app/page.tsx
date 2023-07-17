"use client";

import { useAuth } from "@pangeacyber/react-auth";
import Link from "next/link";

export default function Home() {
  const { authenticated } = useAuth();

  return (
    <main className="relative w-full h-full flex flex-col text-base">
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 translate-y-1/2">

        {authenticated && <p className="text-l font-semibold">Please navigate to the <Link className="underline"href={"/chat"}>chat page</Link></p>}
        {!authenticated && <p className="text-l font-semibold">Please sign in</p>}
      </div>
    </main>
  );
}
