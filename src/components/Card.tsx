import React from "react";

interface CardProps {
  name: string;
  imageUrl: string;
  uri:string,
  subtitle?: string;
  durationMs?: number;
}

const Card: React.FC<CardProps> = ({ name, imageUrl, subtitle, durationMs, uri }) => {
  return (
    <a href={uri} target="_blank" className=" easeinOut sm:max-w-[200px] w-full">
      <h1 className="text-16 max-md:text-14 w-full text-center mb-2 truncate font-bold text-white-1">
        {name}
      </h1>
      <figure className="flex flex-col max-sm:flex-row max-sm:h-[70px] max-sm:pl-2 rounded-xl items-center shadow-2xl border border-gray-800 gap-2">
        <div className="md:w-[80px] mt-1 easeinOut md:h-[80px] flex-shrink-0 h-[50px] w-[50px] rounded-full flex items-center justify-center overflow-hidden">
          <img
            alt={name}
            src={imageUrl}
            className="object-fit easeinOut object-center min-h-full object-cover md:w-[80px] max-sm:w-[50px] max-sm:h-[50px] md:h-[80px] h-[50px] w-[50px]"
          />
        </div>
        <div className="flex px-2 py-3 w-full">
          {subtitle && (
            <h2 className="flex-1 flex items-center justify-center text-12 truncate font-normal  text-white-4">
              <span className="font-semibold text-white-1">{subtitle}</span>
            </h2>
          )}
          {durationMs && (
            <h2 className="flex-1 flex items-center justify-center text-12 font-normal text-white-4">
              <span className="font-semibold whitespace-nowrap text-white-1">
                {Math.round(durationMs / (1000 * 60))}
              </span>{" "}
              &nbsp; minutes.
            </h2>
          )}
        </div>
      </figure>
    </a>
  );
};

export default Card;
