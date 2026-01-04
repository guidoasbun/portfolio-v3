"use client";

import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/three/HeroBackground";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { motion } from "framer-motion";
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { useAnalytics } from "@/hooks/useAnalytics";
import { createErrorBoundaryHandler } from "@/lib/errors";

export function HeroSection() {
  const { trackEvent } = useAnalytics();

  const scrollToProjects = () => {
    // Track CTA click
    trackEvent("cta_click", {
      cta_text: "View Projects",
      cta_location: "hero_section",
      cta_destination: "#projects",
    });

    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    // Track CTA click
    trackEvent("cta_click", {
      cta_text: "Get in Touch",
      cta_location: "hero_section",
      cta_destination: "#contact",
    });

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSocialClick = (platform: string, url: string) => {
    // Track social link click
    trackEvent("social_link_click", {
      platform: platform,
      link_url: url,
      link_location: "hero_section",
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background with Error Boundary */}
      <ErrorBoundary
        onError={createErrorBoundaryHandler("HeroBackground")}
        fallback={
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        }
      >
        <HeroBackground className="absolute inset-0 w-full h-full" />
      </ErrorBoundary>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content with Glass Morphism - no animations to avoid hydration mismatch */}
          <div className="glass rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/20 backdrop-blur-md">
            {/* Greeting */}
            <p className="text-base sm:text-lg lg:text-xl text-foreground/70 mb-3 sm:mb-4">
              Hi, I&apos;m
            </p>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent leading-tight">
              Guido Asbun
            </h1>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
              Cloud Infrastructure & Software Engineering
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Building scalable cloud infrastructure and CI/CD pipelines while
              crafting performant web applications. Specializing in AWS, Docker,
              Kubernetes, and modern DevOps practices.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Button
                size="lg"
                onClick={scrollToProjects}
                className="w-full sm:w-auto min-h-[44px]"
              >
                View Projects
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={scrollToContact}
                className="w-full sm:w-auto min-h-[44px]"
              >
                <FiMail className="mr-2" />
                Get in Touch
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 sm:gap-6 justify-center">
              <a
                href="https://github.com/guidoasbun"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  handleSocialClick("GitHub", "https://github.com/guidoasbun")
                }
                className="p-2 text-foreground/70 hover:text-foreground transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="GitHub"
              >
                <FiGithub className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/guidoasbun"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  handleSocialClick(
                    "LinkedIn",
                    "https://www.linkedin.com/in/guidoasbun"
                  )
                }
                className="p-2 text-foreground/70 hover:text-foreground transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a
                href="mailto:guido@asbun.io"
                onClick={() =>
                  handleSocialClick("Email", "mailto:guido@asbun.io")
                }
                className="p-2 text-foreground/70 hover:text-foreground transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Email"
              >
                <FiMail className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-8 sm:mt-12 lg:mt-16 hidden sm:block">
            <button
              onClick={scrollToProjects}
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 flex flex-col items-center gap-2 mx-auto min-h-[44px] p-2"
              aria-label="Scroll to projects"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wider">
                Scroll Down
              </span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/50 pointer-events-none" />
    </section>
  );
}
