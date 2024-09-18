import React from "react";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import Link from "next/link";

const FooterCompoment = () => {
  return (
    <div className="bg-black-2  flex items-center !h-[70px] !rounded-none text-[11px] text-gray-400 !justify-center">
      <ul className="flex w-full h-full items-center justify-end px-5">
        
        <div className="flex items-center justify-between gap-5">
          <li>
            <Link href={"/donate"}>Contact</Link>
          </li>
          <li>
            <Link href={"/donate"}>Donate</Link>
          </li>
          <li>
            <Link href={"/donate"}>Privacy Policy</Link>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default FooterCompoment;
