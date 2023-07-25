"use client";

import Link from "next/link";

export default function Home() {

  return (
    <main className="relative flex flex-col w-full h-full text-base">
      <div className="absolute -translate-x-1/2 translate-y-1/2 left-1/2 top-1/3">
        <p className="font-semibold text-l">Please navigate to the <Link className="underline" href={"/chat"}>chat page</Link></p>
      </div>
    </main>
  );
}
