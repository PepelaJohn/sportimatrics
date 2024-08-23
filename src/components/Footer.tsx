import React from "react";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";



const FooterCompoment = () => {
  return (
    <Footer
      container
      className="bg-black-2  flex items-center !rounded-none  !justify-center"
    >
      <div className="max-w-5xl max-sm:px-4 sm:px-14 flex  w-full justify-between   ">
        <FooterCopyright href="#" by="Spotimetrics" year={2022} />
        <FooterLinkGroup>
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Feedback</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
          <FooterLink
            href="https://buymeacoffee.com/spotimetrics"
            target="_blank"
          >
            Donate
          </FooterLink>
        </FooterLinkGroup>
      </div>
    </Footer>
  );
};

export default FooterCompoment;
