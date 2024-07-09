"use client";

import FileUpload from "@/components/FileUPload";
import { Progress } from "@/components/ui/progress";
import { ERROR } from "@/constants";

import { cn } from "@/lib/utils";

import { useState, useTransition } from "react";

import { useDispatch } from "react-redux";

const Page = () => {
  const [progress, setProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  

  // const router = useRouter();

  const [isPending, _] = useTransition();

  return (
    <div className="w-full flex flex-col items-center justify-center h-full nav-height">
      <div
        className={cn(
          "relative  flex-1 my-16 w-[250px] text-white-1  max-h-[200px] rounded-xl bg-slate-900 p-2 ring-1 cursor-pointer ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
          {
            "ring-blue-900/25 bg-blue-900/10": dragOver,
          }
        )}
      >
        <FileUpload
          dragOver={dragOver}
          file={file}
          progress={progress}
          setDragOver={setDragOver}
          setFile={setFile}
          setProgress={setProgress}
        />
      </div>
    </div>
  );
};

export default Page;

