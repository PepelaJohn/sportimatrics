"use client";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";
import { ChangeEvent, DragEvent } from "react";
import { uploadToDB } from "@/api";

const Home = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
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
                filename.startsWith("StreamingHistory_music_") &&
                filename.endsWith(".json")
              ) {
                musicHistory.push(...jsonContent);
              } else if (
                filename.startsWith("StreamingHistory_podcast_") &&
                filename.endsWith(".json")
              ) {
                podcastHistory.push(...jsonContent);
              } else if (
                filename.startsWith("Playlist") &&
                filename.endsWith(".json")
              ) {
                playlistHistory.push(...jsonContent.playlists);
              } else {
                rest[filename.replace(".json", "").toLowerCase()] = jsonContent;
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
      setData(combinedData);
      dispatch({ type: SUCCESS, payload: "Successfully uploaded" });
    }

    setProcessingComplete(true);
  };

  

  const handleUpload = async () => {
    if (data) {
      await uploadToDB(data);
      console.log(data.playlists)
      dispatch({ type: SUCCESS, payload: "Data successfully uploaded to DB" });
    }
  };

  return (
    <section className="h-full w-full text-white-1 flex flex-col items-center justify-center">
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
        <label
          className={`h-full w-full px-2 ${
            dragOver ? "bg-gray-800" : ""
          } cursor-pointer rounded-lg py-3 flex items-center justify-center`}
          htmlFor="file"
        >
          <div className="flex text-gray-1 justify-center items-center flex-col gap-5">
            <Upload className="text-xs w-6" />
            <p className="text-[10px]">.ZIP</p>
          </div>
        </label>
      </div>
      {Object.keys(fileProgress).length > 0 && (
        <div className="mt-4 w-full max-w-xl">
          {Object.keys(fileProgress).map((filename) => (
            <div
              key={filename}
              className="flex justify-between items-center bg-gray-800 p-2 rounded-lg mb-2"
            >
              <span className="truncate">{filename}</span>
              <span>{fileProgress[filename].toFixed(2)}%</span>
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
