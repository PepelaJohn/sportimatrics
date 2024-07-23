import React from "react";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

const x = true;

const FooterCompoment = () => {
  return x ? (
    <Footer container className="bg-black-2  flex items-center   !justify-center">
     <div className="max-w-5xl max-sm:px-4 sm:px-14 flex  w-full justify-between   ">
     <FooterCopyright href="#" by="Spotimetrics" year={2022} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Feedback</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
        <FooterLink href="https://buymeacoffee.com/spotimetrics" target="_blank">Donate</FooterLink>
      </FooterLinkGroup>
     </div>
    </Footer>
  ) : (
    <footer className="text-white-1 items-center h-[18vh] justify-center bg-black-4 flex flex-col">
      <div className="max-w-5xl max-sm:px-4 sm:px-14   w-full flex-1 flex  pt-2 justify-between">
        <div className="max-w-[3/12] gap-1 text-sm flex  flex-col">
          <span className="mb-1">SpotiMetrics</span>
          <span className="text-white-2 cursor-pointer text-xs">Home</span>
          <span className="text-white-2 cursor-pointer text-xs">Feedback</span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col">
          <span className="mb-1">Legal</span>
          <span className="text-white-2 cursor-pointer text-xs">Privacy</span>
          <span className="text-white-2 cursor-pointer text-xs">
            Terms and Conditions
          </span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col">
          <span className="mb-1">Company</span>
          <a href="https://buymeacoffee.com/spotimetrics" target="_blank" className="text-white-2 cursor-pointer text-xs">Donate</a>
          <span className="text-white-2 cursor-pointer text-xs">Contact</span>
        </div>
        <div className="max-w-[3/12] gap-1 text-sm flex flex-col ">
          <span className="mb-1">Downloads</span>

          <span className="text-white-2 cursor-pointer text-xs">
            Coming soon...
          </span>
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

export default FooterCompoment;
