"use client";
import { Upload } from "lucide-react";
import { ChangeEvent, DragEvent } from "react";
import { useDispatch } from "react-redux";
import { ERROR, SUCCESS } from "@/constants";
import { uploadToDB } from "@/api";
type Props = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  dragOver?: boolean;
  setDragOver: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileUpload = ({
  file,
  setFile,
  dragOver,
  progress,
  setDragOver,
  setProgress,
}: Props) => {
  const dispatch = useDispatch();
  const handleUpload = () => {
    if (!file) {
      dispatch({
        type: ERROR,
        payload: "Invalid File",
      });
      return;
    }

    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const fileSize = file.size;
    let offset = 0;

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        offset += (e.target.result as ArrayBuffer).byteLength;
        const percentCompleted = Math.round((offset / fileSize) * 100);
        setProgress(percentCompleted);

        if (offset < fileSize) {
          readNextChunk();
        } else {
          dispatch({
            type: SUCCESS,
            payload: "File Uploaded",
          });
          // After reading all chunks, you can send the file to the backend here

          await uploadToDB({ file: JSON.stringify(reader.result) });
          
        }
      }
    };

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    // Start reading the first chunk
    readNextChunk();
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile((_) => selectedFile);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();

    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const selectedFile = event.dataTransfer.files[0];
    setFile(selectedFile);
  };

  const uploadFrontend = () => {
    if (file?.type.toLowerCase() === "application/json") {
      handleUpload();
      return;
    }
    dispatch({
      type: ERROR,
      payload: "Invalid File Selected",
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col gap-3 items-center h-full"
    >
      <label
        htmlFor="file"
        className="flex-1 flex items-center justify-center w-full cursor-pointer"
      >
        <Upload />
      </label>
      <input
        type="file"
        name="file"
        id="file"
        hidden
        onChange={handleFileChange}
      />
      <p className="text-xs text-zinc-500">Drag your file here</p>
      {/* <button onClick={handleUpload}>Upload</button> */}
      {progress > 0 && (
        <div>
          <p>Upload Progress: {progress}%</p>
          <progress value={progress} max="100" />
        </div>
      )}

      <p className="text-xs text-zinc-500">JSON, ZIP</p>
      <button
        onClick={uploadFrontend}
        disabled={!file?.name}
        className="text-xs bg-green-400 max-w-[100px] py-1 rounded-lg w-full"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;

{
  /**const user = User.findOne({ _id });
        
        user.streams = jsonData;
        await user.save() */
}
