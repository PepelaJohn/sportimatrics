import Image from "next/image";
import React from "react";

const PodcastCard = ({
  name,
  plays,
  msPlayed,
  i,
  sortdirection = "up",
}: artistDataType) => {
  // const router = useRouter();

  return (
    <div className="cursor-pointer md:max-w-[200px] w-full">
      <h1 className="text-16 max-md:text-14 w-full text-center mb-2 truncate font-bold  text-white-1">
        <span className="text-white-4">{i! + 1}</span>. {name}
      </h1>
      <figure className="flex flex-col max-sm:flex-row max-sm:h-[70px] max-sm:pl-2 rounded-xl  items-center shadow-2xl border border-gray-800 gap-2">
        <div className="md:w-[110px] mt-1   md:h-[110px] flex-shrink-0 h-[50px] w-[50px] rounded-full  flex items-center justify-center overflow-hidden ">
        
            <img
              alt={name}
              src={"/images/1.jpg"}
              className="object-fit object-center min-h-full object-cover md:w-[150px]  max-sm:w-[50px] max-sm:h-[50px] md:h-[150px] h-[50px] w-[50px] "
            ></img>
        
        </div>
        <div className="flex  px-2 py-3 w-full  ">
          <h2 className="flex-1 flex items-center justify-center text-12 truncate font-normal capitalize text-white-4">
            <span className="font-semibold text-white-1"> {plays}</span>&nbsp; plays
          </h2>
          <h2 className="flex-1 flex items-center justify-center text-12  font-normal  text-white-4">
            <span className="font-semibold whitespace-nowrap text-white-1">
              {Math.round(msPlayed / (1000 * 60))}
            </span>{" "}
            &nbsp; minutes.
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
