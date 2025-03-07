//Donations page
"use client";

import Head from "next/head";

export default function Profile() {

  return (
    <div className="min-h-screen w-full  flex flex-col items-center  text-gray-100">
      <Head>
        <title>Profile - SpotiMetrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl p-8 nav-height">
        <div className="relative flex flex-col w-full min-w-0 mb-6 break-words  rounded-2xl border-stone-200 bg-light/30 draggable">
          <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
            <div className="flex flex-wrap mb-6 xl:flex-nowrap">
              <div className="w-[300px] flex flex-col gap-5">
                <a href="https://buymeacoffee.com/spotimetrics" target="_blank" className=" text-xs border p-2 text-center bg-gray-800">
                  Buy Me a Coffee
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
