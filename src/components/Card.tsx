import React from "react";

type Props = {

  artists: [
    {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    },
    {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    },

  ];

  disc_number: 1;
  duration_ms: 124880;
  explicit: false;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href:string;
  id: string;
  is_local: boolean;
  name: string // 'Que Sera Sera (Whatever Will Be, Will Be) [From "The Man Who Knew Too Much"] (with Frank DeVol & His Orchestra)';
  popularity: number;
  preview_url: string ;
  track_number: number;
  type: string
  uri: string;
};

const Card = (props: {[key:string | number]:any}) => {
  
  
  return (
    <div className="cursor-pointer easeinOut sm:max-w-[200px] w-full">
      <h1 className="text-16 max-md:text-14 w-full text-center mb-2 truncate font-bold  text-white-1">
        {props.props?.name}
      </h1>
      <figure className="flex flex-col max-sm:flex-row max-sm:h-[70px] max-sm:pl-2 rounded-xl  items-center shadow-2xl border border-gray-800 gap-2">
        <div className="md:w-[80px] mt-1  easeinOut md:h-[80px] flex-shrink-0 h-[50px] w-[50px] rounded-full  flex items-center justify-center overflow-hidden ">
          <img
            alt={props.props?.name}
            src={props.props?.album.images[props.props.album.images.length - 2].url}
            className="object-fit easeinOut object-center min-h-full object-cover md:w-[80px]  max-sm:w-[50px] max-sm:h-[50px] md:h-[80px] h-[50px] w-[50px] "
          ></img>
        </div>
        <div className="flex  px-2  py-3 w-full  ">
          <h2 className="flex-1 flex items-center justify-center text-12 truncate font-normal capitalize text-white-4">
            <span className="font-semibold text-white-1"> {}</span>&nbsp;
            plays
          </h2>
          <h2 className="flex-1 flex items-center justify-center text-12  font-normal  text-white-4">
            <span className="font-semibold whitespace-nowrap text-white-1">
              {Math.round(props.props.duration_ms / (1000 * 60))}
            </span>{" "}
            &nbsp; minutes.
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default Card;
