"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import JSZip from "jszip";
import { Upload, Trash2, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { ERROR, SUCCESS } from "@/constants";
import type { ChangeEvent, DragEvent } from "react";
import { uploadToDB } from "@/api";

interface FileProgress {
  [filename: string]: number;
}

interface ProcessedData {
  music_history?: any[];
  podcast_history?: any[];
  playlists?: any[];
  [key: string]: any;
}

const FileUploader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [data, setData] = useState<ProcessedData>({});
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile && (selectedFile.type === "application/zip" || selectedFile.type === "application/x-zip-compressed")) {
      await processFile(selectedFile);
    } else {
        console.log(selectedFile.type)
      setError("Please upload a zip file");
    //   dispatch({ type: ERROR, payload: "Please upload a zip file" });
    }
  }, [dispatch]);

  const handleFileUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/zip" || file.type === "application/x-zip-compressed")) {
        await processFile(file);
      } else if (file) {
        setError("Please upload a zip file");
        dispatch({ type: ERROR, payload: file.type });
      }
      
  }, [dispatch]);

  const removeFile = useCallback((filename: string) => {
    setFileProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[filename];
      return newProgress;
    });
  }, []);

  const processFile = async (file: File) => {
    setError(null);
    setProcessingComplete(false);
    setIsUploading(true);
    
    const zip = new JSZip();
    let zipData: JSZip;
    
    try {
      zipData = await zip.loadAsync(file);
    } catch (error: any) {
      setIsUploading(false);
      setError("Error parsing file. Please ensure it's a valid zip file.");
      dispatch({ type: ERROR, payload: "Error parsing zip file" });
      return;
    }

    const musicHistory: any[] = [];
    const podcastHistory: any[] = [];
    const playlistHistory: any[] = [];
    const rest: { [key: string]: any } = {};

    try {
      await Promise.all(
        Object.keys(zipData.files).map(async (filename) => {
          if (
            !filename.endsWith(".json") ||
            filename.toLowerCase().includes("inferences") ||
            filename.toLowerCase().includes("searchqueries")
          ) {
            return; // Skip non-JSON files
          }

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
                const simpleName = filename.split("/").pop()?.replace(".json", "") || filename;

                if (filename.includes("StreamingHistory_music_")) {
                  musicHistory.push(...jsonContent);
                } else if (filename.includes("StreamingHistory_podcast_")) {
                  podcastHistory.push(...jsonContent);
                } else if (filename.includes("Playlist")) {
                  playlistHistory.push(...(jsonContent.playlists || []));
                } else {
                  rest[simpleName.toLowerCase()] = jsonContent;
                }
              } catch (error: any) {
                console.error(`Error parsing ${filename}:`, error);
              }
            });
        })
      );

      if (musicHistory.length === 0 && podcastHistory.length === 0) {
        setError("No valid streaming history files found in the archive");
        dispatch({ type: ERROR, payload: "No streaming history files found" });
      } else {
        const combinedData = {
          music_history: musicHistory,
          podcast_history: podcastHistory,
          playlists: playlistHistory,
          ...rest,
        };
        setData(combinedData);
        setProcessingComplete(true);
        dispatch({ type: SUCCESS, payload: "Files successfully processed" });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      dispatch({ type: ERROR, payload: err.message || "Processing error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (Object.keys(data).length === 0) {
      dispatch({ type: ERROR, payload: "No data to upload" });
      return;
    }
    
    setIsUploading(true);
    
    try {
     const response =  await uploadToDB(data);

     if(response.ok){

       dispatch({ type: SUCCESS, payload: "Data successfully uploaded" });
       setFileProgress({});
       setData({});
       setProcessingComplete(false);
       router.push('/insights');
     }else{

       dispatch({ type: ERROR, payload: "Upload failed" });
     }
    } catch (err: any) {
      dispatch({ type: ERROR, payload: err.message || "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const getMusicCount = () => data.music_history?.length || 0;
  const getPodcastCount = () => data.podcast_history?.length || 0;
  const getPlaylistCount = () => data.playlists?.length || 0;

  return (
    <div className="w-full max-w-2xl mx-auto nav-height px-4 py-8">
      <div className="rounded-xl bg-gradient-to-br from-zinc-900 to-black shadow-xl p-6 w-full border border-zinc-800">
        <h2 className="text-xl font-semibold text-white-1 mb-6 text-center">
          Upload Your Spotify Data
        </h2>
        
        {!processingComplete && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-300 border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver 
                ? "border-green-500 bg-green-900/10" 
                : "border-zinc-700 hover:border-green-500"
            }`}
          >
            <input
              hidden
              id="file-upload"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
            />
            
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 mb-4 text-green-500" />
              <p className="text-lg text-zinc-300 mb-2">
                Drop your Spotify data here
              </p>
              <p className="text-sm text-zinc-500 mb-4">
                or click to browse files
              </p>
              <div className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-full text-white-1 text-sm transition-colors">
                Select ZIP File
              </div>
            </label>
          </div>
        )}
        
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {Object.keys(fileProgress).length > 0 && (
          <div className="mt-6 space-y-2 max-h-60 overflow-y-auto pr-2">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Processing files</h3>
            {Object.keys(fileProgress).map((filename) => {
              const displayName = filename.split("/").pop()?.replace(".json", "") || filename;
              const progress = fileProgress[filename];
              
              return (
                <div
                  key={filename}
                  className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <FileText className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="truncate text-zinc-300">{displayName}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <span className="text-xs text-zinc-400 w-9 text-right">
                      {progress.toFixed(0)}%
                    </span>
                    
                    <button
                      onClick={() => removeFile(filename)}
                      className="text-red-400 p-1 rounded hover:bg-zinc-700 transition-colors"
                      aria-label="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {processingComplete && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-green-300 font-medium">Processing complete</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-white-1">{getMusicCount()}</p>
                  <p className="text-xs text-green-400 mt-1">Music Tracks</p>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-white-1">{getPodcastCount()}</p>
                  <p className="text-xs text-green-400 mt-1">Podcasts</p>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-white-1">{getPlaylistCount()}</p>
                  <p className="text-xs text-green-400 mt-1">Playlists</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-3 px-4 rounded-full font-medium transition-all
                ${isUploading
                  ? "bg-green-700 text-green-100 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 text-white-1"
                }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;