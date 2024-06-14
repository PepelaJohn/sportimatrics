'use client'
import Head from 'next/head';
import { FiEye } from 'react-icons/fi'; // Import eye icon from react-icons
import { useState } from 'react';

// Dummy data (replace with actual fetching logic later)
const dummyPlaylists = [
  { id: '1', name: 'Playlist A', description: 'Description of Playlist A', imageUrl: '/images/playlist1.jpg' },
  { id: '2', name: 'Playlist B', description: 'Description of Playlist B', imageUrl: '/images/playlist2.jpg' },
  { id: '3', name: 'Playlist C', description: 'Description of Playlist C', imageUrl: '/images/playlist3.jpg' },
];

const dummyMostListenedSongs = [
  { id: '1', name: 'Song A', artists: ['Artist X'], play_count: 500000 },
  { id: '2', name: 'Song B', artists: ['Artist Y'], play_count: 400000 },
  { id: '3', name: 'Song C', artists: ['Artist Z'], play_count: 450000 },
];

const dummyTopGenre = 'Pop'; // Replace with actual data

export default function Profile() {
  const [isListeningTimeVisible, setIsListeningTimeVisible] = useState(false);

  const toggleListeningTimeVisibility = () => {
    setIsListeningTimeVisible(!isListeningTimeVisible);
  };

  return (
    <div className="min-h-screen w-full  flex flex-col items-center justify-center  text-gray-100">
      <Head>
        <title>Profile - SpotiMetrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Playlists Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Playlists</h2>
            {dummyPlaylists.map((playlist) => (
              <div key={playlist.id} className="flex items-center space-x-4 mb-4">
                <img src={playlist.imageUrl} alt={playlist.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold">{playlist.name}</p>
                  <p className="text-sm">{playlist.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Listening Time Card */}
          <div className="bg-gray-800 p-6 rounded-lg relative">
            <h2 className="text-xl font-bold mb-4">Total Listening Time</h2>
            <div className="flex items-center justify-center h-full">
              {isListeningTimeVisible ? (
                <p className="text-4xl font-bold">120 hrs 30 mins</p>
              ) : (
                <button onClick={toggleListeningTimeVisibility} className="text-4xl text-gray-400 hover:text-gray-200">
                  <FiEye />
                </button>
              )}
            </div>
          </div>

          {/* Most Listened Songs Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Most Listened Songs</h2>
            <ol className="list-decimal list-inside">
              {dummyMostListenedSongs.map((song) => (
                <li key={song.id} className="mb-2">
                  <p className="font-bold">{song.name}</p>
                  <p className="text-sm">{song.artists.join(', ')}</p>
                  <p className="text-sm">{song.play_count.toLocaleString()} plays</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Top Genre Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Top Genre</h2>
            <p className="text-2xl font-bold">{dummyTopGenre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
