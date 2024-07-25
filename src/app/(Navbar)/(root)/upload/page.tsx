"use client";
import { useEffect, useState } from "react";
import JSZip from "jszip";

import { Trash2 as Delete } from "lucide-react";
import { useDispatch } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";
import { ChangeEvent, DragEvent } from "react";
import { uploadToDB } from "@/api";
import { useRouter } from "next/navigation";

const Home = () => {
  const [data, setData] = useState<{ [key: string]: any }>({});
  const router = useRouter()
  const [fileProgress, setFileProgress] = useState<{
    [filename: string]: number;
  }>({});
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setProcessingComplete(false);
    const zip = new JSZip();
    let zipData: JSZip;
    try {
      zipData = await zip.loadAsync(file);
    } catch (error: any) {
      dispatch({ type: ERROR, payload: "Error parsing file" });
      return;
    }

    const musicHistory: any[] = [];
    const podcastHistory: any[] = [];
    const playlistHistory: { [key: string]: any } = [];
    let rest: { [key: string | number]: any } = {};

    await Promise.all(
      Object.keys(zipData.files).map(async (filename) => {
        if (
          !filename.endsWith(".json") ||
          filename.toLowerCase().startsWith("inferences") ||
          filename.toLowerCase().startsWith("searchqueries")
        )
          return; // Skip non-JSON files

        return zipData.files[filename]
          .async("string", (metadata) => {
            setFileProgress((prevProgress) => ({
              ...prevProgress,
              [filename]: metadata.percent,
            }));
          })
          .then((fileContent) => {
            try {
              const jsonContent = JSON.parse(fileContent);

              if (
                filename.includes("StreamingHistory_music_") &&
                filename.endsWith(".json")
              ) {
                musicHistory.push(...jsonContent);
              } else if (
                filename.includes("StreamingHistory_podcast_") &&
                filename.endsWith(".json")
              ) {
                podcastHistory.push(...jsonContent);
              } else if (
                filename.includes("Playlist") &&
                filename.endsWith(".json")
              ) {
                playlistHistory.push(...jsonContent.playlists);
              } else {
                rest[
                  filename
                    .split("/")
                    [filename.split.length - 1]?.replace(".json", "")
                    ?.toLowerCase()
                ] = jsonContent;
              }
            } catch (error: any) {
              dispatch({
                type: ERROR,
                payload: error.message || "Error parsing file",
              });
            }
          });
      })
    );

    if (musicHistory.length === 0 && podcastHistory.length === 0) {
      dispatch({ type: ERROR, payload: "No files" });
    } else {
      const combinedData = {
        music_history: musicHistory,
        podcast_history: podcastHistory,
        playlists: playlistHistory,
        ...rest,
      };
      setData(combinedData)
     

      dispatch({ type: SUCCESS, payload: "Successfully uploaded" });
    }

    if (musicHistory.length !== 0 || podcastHistory.length !== 0) {
      setProcessingComplete(true);
    }
  };

  const handleUpload = async () => {
    if (!!Object.keys(data).length) {
      await uploadToDB(data);

      dispatch({ type: SUCCESS, payload: "Data successfully uploaded to DB" });
      setFileProgress({});
      setData({});
      setProcessingComplete(false);
      router.push('/')
    } else {
      dispatch({ type: ERROR, payload: "No data to upload" });
    }
  };

  return (
    <section className="h-full w-full text-white-1 flex flex-col items-center justify-center">
      {!processingComplete && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex bg-gray-900 min-h-[150px] min-w-[180px] rounded-lg"
        >
          <input
            hidden
            id="file"
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="mt-4"
          />
          {/* <label
          className={`h-full w-full px-2 ${
            dragOver ? "bg-gray-800" : ""
          } cursor-pointer rounded-lg py-3 flex items-center justify-center`}
          htmlFor="file"
        >
          <div className="flex text-gray-1 justify-center items-center flex-col gap-5">
            <Upload className="text-xs w-6" />

            <p className="text-[11px]">Drag and drop your file here</p>
            <p className="text-[10px]">.ZIP</p>
          </div>
        </label> */}

          <label
            className={`h-full w-full  px-2 custum-file-upload border-gray-1 ${
              dragOver ? "bg-gray-800" : ""
            } cursor-pointer rounded-lg py-3 flex items-center justify-center`}
            htmlFor="file"
          >
            <div className="icon">
              <svg
                className="fill-gray-1"
                viewBox="0 0 24 24"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    fill=""
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="flex flex-col items-center text-xs text-gray-1">
              <span>Drag files here</span>
              <span>.ZIP</span>
            </div>
            <input id="file" type="file" />
          </label>
        </div>
      )}
      {Object.keys(fileProgress).length > 0 && (
        <div className="mt-4 w-full max-w-xl">
          {Object.keys(fileProgress).map((filename) => (
            <div
              key={filename}
              className="flex justify-between items-center bg-zinc-900 py-3 px-5 text-sm rounded-lg mb-2"
            >
              <span className="truncate capitalize">
                {filename
                  .split("/")
                  [filename.split.length - 1]?.replace(".json", "") || filename.replace('json', "")}
              </span>
              <div className="flex gap-3">
                <span className="flex-1">
                  {fileProgress[filename].toFixed(0)}%
                </span>

                <span className="text-red-600 h-full cursor-pointer hover:bg-zinc-950 easeinOut rounded-lg px-3">
                  <Delete className="w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {processingComplete && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded"
        >
          Upload
        </button>
      )}
    </section>
  );
};

export default Home;
