"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { SOCIAL_LINKS, CONTACT_INFO, APP_CONFIG } from "@/lib/constants";
import { fadeIn, slideUp } from "@/lib/animations";

interface FooterLink {
  label: string;
  href: string;
}

const quickLinks: FooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const iconMap: Record<string, React.ReactElement> = {
  github: <FaGithub className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />,
  twitter: <FaTwitter className="w-5 h-5" />,
  mail: <FaEnvelope className="w-5 h-5" />,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="relative glass-light border-t border-foreground/10 mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#059669] bg-clip-text mb-3 sm:mb-4">
              {APP_CONFIG.name}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/60 mb-3 sm:mb-4">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={social.name}
                >
                  {iconMap[social.icon]}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={e => handleLinkClick(e, link.href)}
                    className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors inline-block py-1 min-h-[32px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="sm:col-span-2 md:col-span-1"
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Contact
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-foreground/60">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-foreground transition-colors inline-block py-1 min-h-[32px] flex items-center"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-foreground transition-colors inline-block py-1 min-h-[32px] flex items-center"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="py-1">{CONTACT_INFO.location}</li>
              <li className="text-xs py-1">{CONTACT_INFO.timezone}</li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-foreground/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 gap-2">
            <p className="text-xs sm:text-sm text-foreground/60 text-center sm:text-left">
              &copy; {currentYear} {APP_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-foreground/60 flex items-center">
              Made with{" "}
              <FaHeart className="mx-1 text-red-500 w-3 h-3 sm:w-4 sm:h-4" />{" "}
              using Next.js & Three.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
