import { formatNumberWithCommas, getNextHour } from "@/lib/utils";
import React from "react";

interface ActiveStatsProps {
  mostActiveHour: string;
  mostActiveMonth: string;
  mostListenedArtist: string;
  mostListenedTrack: string;
  totalMinutes: number;
}

const ActiveStatsTable: React.FC<ActiveStatsProps> = ({
  mostActiveHour,
  mostActiveMonth,
  mostListenedArtist,
  mostListenedTrack,
  totalMinutes,
}) => {
  // Data for rendering in a consistent way
  const statsData = [
    {
      label: "Most Active Hour",
      value: `${mostActiveHour}:00 - ${getNextHour(mostActiveHour)}:00`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      label: "Most Active Month",
      value: mostActiveMonth,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      label: "Most Listened Artist",
      value: mostListenedArtist,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
        </svg>
      )
    },
    {
      label: "Most Listened Track",
      value: mostListenedTrack,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      label: "Total Minutes",
      value: `${formatNumberWithCommas(Math.floor(totalMinutes))} minutes`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="overflow-hidden rounded-lg text-white">
      <table className="min-w-full divide-y divide-gray-700">
        <tbody className="divide-y divide-gray-700">
          {statsData.map((stat, index) => (
            <tr key={index} className="transition-colors hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-green-500 mr-3">
                    {stat.icon}
                  </div>
                  <div className="text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {stat.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveStatsTable;