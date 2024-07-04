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

{
  /* <div className="relative flex flex-1 flex-col  items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "Application/zip": [".zip"],
            "Applicatio/json": [".json"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 text-white-1 cursor-context-menu  flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-100 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-100 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col  justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {isPending ? null : (
                <p className="text-xs text-zinc-500">JSON, ZIP</p>
              )}
            </div>
          )}
        </Dropzone>
      </div> */
}
