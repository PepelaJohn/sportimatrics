"use client";
import BarChart from "@/components/BarChart";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Info, Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type PeriodT = {
  period: string;
  minutesPlayed: number;
};

type ArtistDataT = {
  artistName: string;
  minutesPlayed: number;
  segment: string;
  periods: PeriodT[];
};

const ArtistPopup = () => {
  const router = useRouter();
  const link = window.location.href.split("/");
  
  let location = link[link.length - 1];
  location = location.split("%20").join(" ");
  
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState<ArtistDataT[] | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    values: number[];
  } | null>(null);
  
  const searchArtistByName = (name: string) => {
    const artist = processedData?.find(
      (artist) => artist?.artistName?.toLowerCase() === name.toLowerCase()
    );
    
    return artist || null;
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dt = window?.sessionStorage.getItem("artistData");
      
      if (dt !== null) {
        setProcessedData(JSON.parse(dt));
      }
      
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const artistProcessed = searchArtistByName(location);
    
    const labels = artistProcessed?.periods?.map((d) =>
      new Date(d.period + "-01").toLocaleString("default", { month: "long" }).slice(0, 3)
    ) || null;
    
    const minutesPlayed = artistProcessed?.periods?.map((p) => p.minutesPlayed) || null;
    
    if (labels === null || minutesPlayed === null) {
      setChartData(null);
    } else {
      setChartData({ labels, values: minutesPlayed });
    }
  }, [processedData, location]);
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="bg-black text-white-1 border-0 rounded-xl max-w-md md:max-w-2xl w-full mx-auto p-0 overflow-hidden">
        <div className="flex flex-col w-full">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
            <DialogTitle className="text-lg md:text-xl font-bold">
              {location}
            </DialogTitle>
           
          </div>
          
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="h-8 w-8 text-green-500 animate-spin" />
                <p className="mt-4 text-sm text-gray-400">Loading artist data...</p>
              </div>
            ) : chartData === null ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Data Available</h3>
                <p className="text-sm text-gray-400 max-w-xs">
                  We couldn&apos;t find any listening data for this artist. Try checking another artist.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Listening Activity</h3>
                  <p className="text-sm text-gray-400">
                    Minutes listened over the past months
                  </p>
                </div>
                
                <div className="h-64">
                  <BarChart 
                data={chartData}
                  
                  />
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Info size={16} className="text-black" />
                  </div>
                  <div>
                    <p className="text-sm">
                      Total listening time: <span className="font-bold">
                        {Math.round(chartData.values.reduce((a, b) => a + b, 0))} minutes
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistPopup;