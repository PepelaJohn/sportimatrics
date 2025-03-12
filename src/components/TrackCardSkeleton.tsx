const TrackCardSkeleton = ({listtype}:{listtype:"Card"|"List"}) => (
    <div className="group bg-gray-900 rounded-xl  overflow-hidden border border-gray-800 shadow-lg animate-pulse">
      <div
        className={` ${listtype === "Card" ? "aspect-square" : "hidden"} sm:block overflow-hidden  relative bg-gray-800`}
      ></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="w-2/3 h-5 bg-gray-700 rounded"></div>
          <div className="w-10 h-5 bg-gray-700 rounded"></div>
        </div>
        <div className="h-3 w-1/2 bg-gray-700 rounded mb-2"></div>
        <div className="flex items-center gap-1 mt-3">
          <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
          <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  export default TrackCardSkeleton; 