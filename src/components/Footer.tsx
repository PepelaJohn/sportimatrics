import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="text-white-1 items-center h-[18vh] justify-center bg-black-1 flex flex-col">
      <div className="max-w-5xl max-sm:px-4 sm:px-14   w-full flex-1 flex  pt-2 justify-between">
        <div className="max-w-[3/12] gap-1 text-sm flex  flex-col">
          <span className="mb-1">SpotiMetrics</span>
          <span className="text-white-2 cursor-pointer text-xs">Home</span>
          <span className="text-white-2 cursor-pointer text-xs">Feedback</span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col">
          <span className="mb-1">Legal</span>
          <span className="text-white-2 cursor-pointer text-xs">Privacy</span>
          <span className="text-white-2 cursor-pointer text-xs">Terms and Conditions</span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col">
          <span className="mb-1">Company</span>
          <span className="text-white-2 cursor-pointer text-xs">Donate</span>
          <span className="text-white-2 cursor-pointer text-xs">Contact</span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col ">
          <span className="mb-1">Downloads</span>
          
          <span className="text-white-2 cursor-pointer text-xs">Coming soon...</span>
        </div>
      </div>
      <div className="mx-width w-full my-2 text-center ">
        <p className="text-[10px] text-white-2">
          All copyrighted content displayed on this website are owned by their
          respective owners. We do not own any rights to the content. All the
          data is provided by Spotify AB
        </p>
        <p className="text-xs">2024&copy; Made with ❤ from Kenya</p>
      </div>
    </footer>
  );
};

export default Footer;
