import React from "react";
import Link from "next/link";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: "Contact", href: "/contact" },
    { name: "Donate", href: "/donate" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-and-conditions" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 w-full border-t">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <span className="text-xs sm:text-sm">&copy; {currentYear} Musimeter. All rights reserved.</span>
          </div>
          
          <nav className="w-full sm:w-auto">
            <ul className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              {footerLinks.map((link) => (
                <li key={link.name} className="hover:text-white-1 transition-colors">
                  <Link href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;