// 'use client'
// import { useState } from 'react';
// import Head from 'next/head';
// import JSZip from 'jszip';
// import { Extractor } from 'unrar-js';

// const Home = () => {
//     const [data, setData] = useState<{ music_history: any[], podcast_history: any[] } | null>(null);

//     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         if (file.name.endsWith('.zip')) {
//             await handleZipFile(file);
//         } else if (file.name.endsWith('.rar')) {
//             // await handleRarFile(file);
//         } else {
//             console.log('Unsupported file format');
//         }
//     };

//     const handleZipFile = async (file: File) => {
//         const zip = new JSZip();
//         const zipData = await zip.loadAsync(file);
//         const musicHistory: any[] = [];
//         const podcastHistory: any[] = [];

//         await Promise.all(Object.keys(zipData.files).map(async (filename) => {
//             if (filename.startsWith('StreamingHistory_music_') && filename.endsWith('.json')) {
//                 const fileContent = await zipData.files[filename].async('string');
//                 try {
//                     const jsonContent = JSON.parse(fileContent);
//                     musicHistory.push(...jsonContent);
//                 } catch (error) {
//                     console.error(`Error parsing ${filename}`, error);
//                 }
//             } else if (filename.startsWith('StreamingHistory_podcast_') && filename.endsWith('.json')) {
//                 const fileContent = await zipData.files[filename].async('string');
//                 try {
//                     const jsonContent = JSON.parse(fileContent);
//                     podcastHistory.push(...jsonContent);
//                 } catch (error) {
//                     console.error(`Error parsing ${filename}`, error);
//                 }
//             }
//         }));

//         if (musicHistory.length === 0 && podcastHistory.length === 0) {
//             console.log('No files');
//         } else {
//             setData({ music_history: musicHistory, podcast_history: podcastHistory });
//         }
//     };

//     const handleRarFile = async (file: File) => {
//         const reader = new FileReader();
//         reader.onload = async (e) => {
//             if (!e.target?.result) return;

//             const arrayBuffer = e.target.result as ArrayBuffer;
//             const extractor = new Extractor(new Uint8Array(arrayBuffer));
//             const extracted = extractor.extract();
//             const musicHistory: any[] = [];
//             const podcastHistory: any[] = [];

//             extracted.files.forEach(file => {
//                 if (file.fileName.startsWith('StreamingHistory_music_') && file.fileName.endsWith('.json')) {
//                     try {
//                         const jsonContent = JSON.parse(new TextDecoder().decode(file.extract()));
//                         musicHistory.push(...jsonContent);
//                     } catch (error) {
//                         console.error(`Error parsing ${file.fileName}`, error);
//                     }
//                 } else if (file.fileName.startsWith('StreamingHistory_podcast_') && file.fileName.endsWith('.json')) {
//                     try {
//                         const jsonContent = JSON.parse(new TextDecoder().decode(file.extract()));
//                         podcastHistory.push(...jsonContent);
//                     } catch (error) {
//                         console.error(`Error parsing ${file.fileName}`, error);
//                     }
//                 }
//             });

//             if (musicHistory.length === 0 && podcastHistory.length === 0) {
//                 console.log('No files');
//             } else {
//                 setData({ music_history: musicHistory, podcast_history: podcastHistory });
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center py-2">
//             <Head>
//                 <title>Upload ZIP or RAR</title>
//                 <meta name="description" content="Upload a ZIP or RAR file and process JSON files" />
//                 <link rel="icon" href="/favicon.ico" />
//             </Head>

//             <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
//                 <h1 className="text-6xl font-bold">Upload ZIP or RAR File</h1>
//                 <input type="file" accept=".zip,.rar" onChange={handleFileUpload} className="mt-4" />
//                 {data && (
//                     <div className="mt-4 text-left w-full max-w-2xl bg-gray-100 p-4 rounded-lg shadow-md">
//                         <h2 className="text-2xl font-bold">Music History</h2>
//                         <pre>{JSON.stringify(data.music_history, null, 2)}</pre>
//                         <h2 className="text-2xl font-bold mt-4">Podcast History</h2>
//                         <pre>{JSON.stringify(data.podcast_history, null, 2)}</pre>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default Home;
