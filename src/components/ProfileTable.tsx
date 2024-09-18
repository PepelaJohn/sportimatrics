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
  return (
    <div className="overflow-x-auto text-white-1">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Statistic
            </th>
            <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-l border-gray-500">
              Most Active Hour
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500">
              {mostActiveHour}:00 - {getNextHour(mostActiveHour)}:00
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-l border-gray-500">
              Most Active Month
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500">
              {mostActiveMonth}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-l border-gray-500">
              Most Listened Artist
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500">
              {mostListenedArtist}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-l border-gray-500">
              Most Listened Track
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500">
              {mostListenedTrack}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-l border-gray-500">
              Total Minutes
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500">
              {formatNumberWithCommas(Math.floor(totalMinutes))} minutes
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ActiveStatsTable;
