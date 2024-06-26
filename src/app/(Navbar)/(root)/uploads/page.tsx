// components/Upload.tsx

'use client'
import { useState, ChangeEvent } from 'react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    //   console.log(e.target.files[0]);
      
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('userId', userId);

    console.log(formData, file)
  };

  return (
    <div className='text-white-1 nav-height'>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
