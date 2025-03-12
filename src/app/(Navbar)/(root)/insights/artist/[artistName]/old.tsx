'use client'
import { getCookie } from "@/lib/utils";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
  popularity: number;
}

const fetchArtist = async (id: string, accessToken: string): Promise<Artist | null> => {
  try {
    const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch artist");
    console.log(res)
    return res.json();
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
};

const ArtistPage = ({ artist }: { artist: Artist | null }) => {
  const [loading, setLoading] = useState(true);
  const [clientArtist, setClientArtist] = useState<Artist | null>(artist);

  useEffect(() => {
    if (!artist) {
      setLoading(true);
      const fetchClientData = async () => {
        const accessToken = process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN as string;
        const res = await fetch(`/api/artist/${window.location.pathname.split("/").pop()}`);
        const data = await res.json();
        setClientArtist(data || null);
        setLoading(false);
      };
      fetchClientData();
    } else {
      setLoading(false);
    }
  }, [artist]);

  if (loading) return <div>Loading...</div>;
  if (!clientArtist) return <div>Artist not found</div>;

  return (
    <div>
      <h1>{clientArtist.name}</h1>
      {clientArtist.images.length > 0 && <img src={clientArtist.images[0].url} alt={clientArtist.name} width={300} />}
      <p>Followers: {clientArtist.followers.total}</p>
      <p>Popularity: {clientArtist.popularity}</p>
      <p>Genres: {clientArtist.genres.join(", ")}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const accessToken = getCookie('_gtPaotwcsA');
  if(!accessToken) window.location.href = "/" 
  const artist = await fetchArtist(id, accessToken);
  return { props: { artist } };
};

export default ArtistPage;
