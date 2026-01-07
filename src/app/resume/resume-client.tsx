"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { motion, type Variants } from "framer-motion";
import {
  FiDownload,
  FiPrinter,
  FiShare2,
  FiBriefcase,
  FiBook,
  FiCode,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiGlobe,
  FiFolder,
  FiAward,
  FiStar,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ApiResponse, Resume } from "@/types";

interface ResumeSection {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string[];
  technologies?: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  date: string;
  gpa?: string;
}

interface Skill {
  category: string;
  items: string[];
}

interface Project {
  name: string;
  technologies: string;
  description: string[];
}

// Resume data from Guido Asbun's actual resume
const mockResumeData = {
  header: {
    name: "Guido Asbun",
    title: "Software Engineer",
    email: "guido@asbun.io",
    phone: "949-239-4144",
    location: "California, USA",
    linkedin: "linkedin.com/in/guidoasbun",
    github: "github.com/guidoasbun",
    website: "guido-asbun.com",
  },
  summary:
    "Software engineer with full-stack and DevOps experience, recently graduated with a B.S. in Computer Science (Cybersecurity concentration). Built production applications using Next.js, FastAPI, and enterprise AWS infrastructure with Terraform IaC. Former Axios intern with proven ability to ship features that improve performance. U.S. Navy veteran with strong leadership and problem-solving skills.",
  experience: [
    {
      title: "Software Engineering Intern",
      company: "Axios Media",
      location: "Remote",
      date: "Jun – Aug 2022",
      description: [
        "Developed production front-end features using React, Next.js, and TypeScript, reducing page load times by 15%",
        "Utilized Docker and CircleCI for CI/CD pipelines, improving development workflow efficiency",
        "Collaborated cross-functionally using GitHub, Jira, and Agile methodologies",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Docker", "CircleCI"],
    },
    {
      title: "Software Engineering Pre-Intern",
      company: "Snap Engineering Academy",
      location: "Remote",
      date: "Jun – Aug 2021",
      description: [
        "Built full-stack mobile app with React Native and Firebase, integrating map APIs for geolocation features",
        "Implemented AR features and ML frameworks (P5.js, ML5.js) for enhanced user experiences",
        "Led team in developing innovative AR applications, demonstrating technical leadership",
      ],
      technologies: ["React Native", "Firebase", "P5.js", "ML5.js"],
    },
  ] as ResumeSection[],
  education: [
    {
      degree: "B.S. Computer Science, Cybersecurity Concentration",
      institution: "California State University, Fullerton",
      location: "Fullerton, CA",
      date: "Dec 2025",
    },
    {
      degree: "A.S. Computer Science",
      institution: "Santa Ana College",
      location: "Santa Ana, CA",
      date: "Dec 2023",
    },
  ] as Education[],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "Swift"],
    },
    {
      category: "Frameworks",
      items: [
        "React",
        "Next.js",
        "FastAPI",
        "Node.js",
        "SwiftUI",
        "Spring Boot",
        "Tailwind CSS",
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        "AWS (ECS, RDS, S3, Cognito, CloudFront, WAF)",
        "Terraform",
        "Docker",
        "Kubernetes",
        "CI/CD (GitHub Actions, CircleCI)",
        "Linux",
      ],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MongoDB", "DynamoDB", "Redis"],
    },
  ] as Skill[],
  projects: [
    {
      name: "Party-Time Event Platform",
      technologies: "Next.js 15, TypeScript, FastAPI, PostgreSQL, Redis, AWS, Terraform",
      description: [
        "Developed full-stack SaaS application for event planning with venue discovery, guest management, and budget tracking",
        "Deployed enterprise AWS infrastructure (ECS, RDS, CloudFront, WAF) with Terraform IaC and CI/CD pipelines",
      ],
    },
    {
      name: "AI-Powered Recipe Generator",
      technologies: "Next.js, OpenAI API, AWS Cognito, DynamoDB, S3, Terraform",
      description: [
        "Built full-stack app with GPT-3.5-turbo and DALL-E 3 integration for AI-generated recipes and images",
        "Implemented Google OAuth authentication and deployed on ECS Fargate using infrastructure as code",
      ],
    },
    {
      name: "iOS Recipe Generator",
      technologies: "SwiftUI, iOS 17+, OpenAI API, MVVM, Combine",
      description: [
        "Developed native iOS app with AI-powered recipe generation using Swift async/await and TaskGroup",
      ],
    },
    {
      name: "Java Compiler",
      technologies: "Java, GPU Cloud Clusters",
      description: [
        "Built and tested compiler leveraging GPU cloud clusters for efficient parallel processing",
      ],
    },
  ] as Project[],
  certifications: ["CompTIA Security+ — Certified"],
  additional: [
    "U.S. Navy Veteran — Developed leadership, discipline, and problem-solving skills in high-pressure environments",
    "Code 2040 — Mentored and reviewed prospective fellows' applications to promote diversity in technology",
  ],
};

export default function ResumePageClient() {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { trackEvent } = useAnalytics();

  // Track resume view on page load
  useEffect(() => {
    trackEvent("resume_view", {
      resume_id: "default",
      resume_version: "1.0",
    });
  }, [trackEvent]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch active resume
      const response = await fetch("/api/resume/active");
      const result: ApiResponse<Resume | null> = await response.json();

      if (!result.success || !result.data) {
        alert("No active resume found. Please contact the administrator.");
        return;
      }

      const activeResume = result.data;

      // Track the download in database
      await fetch(`/api/resume/${activeResume.id}/download`, {
        method: "POST",
      });

      // Track analytics
      trackEvent("resume_download", {
        resume_id: activeResume.id,
        resume_version: activeResume.version,
        download_count: activeResume.downloadCount + 1,
      });

      // Open the resume in a new tab
      window.open(activeResume.fileUrl, "_blank");
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    // Track print action
    trackEvent("resume_download", {
      resume_id: "default",
      resume_version: "1.0-print",
      download_count: 1,
    });

    window.print();
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${mockResumeData.header.name} - Resume`,
          text: `Check out ${mockResumeData.header.name}'s resume`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Resume link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Page Header with Actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-[#048f58] bg-clip-text">
                  Resume
                </h1>
                <p className="text-foreground/70">
                  Download or view my professional experience
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  <FiDownload />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <FiPrinter />
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="gap-2"
                >
                  <FiShare2 />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Resume Content */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-8 sm:p-12 print:shadow-none print:border-0">
              {/* Header Section */}
              <div className="mb-8 pb-8 border-b border-foreground/10">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {mockResumeData.header.name}
                </h1>
                <p className="text-xl text-blue-500 mb-4">
                  {mockResumeData.header.title}
                </p>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <a
                      href={`mailto:${mockResumeData.header.email}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {mockResumeData.header.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{mockResumeData.header.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{mockResumeData.header.location}</span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <a
                    href={`https://${mockResumeData.header.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiLinkedin className="w-4 h-4" />
                    {mockResumeData.header.linkedin}
                  </a>
                  <a
                    href={`https://${mockResumeData.header.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" />
                    {mockResumeData.header.github}
                  </a>
                  <a
                    href={`https://${mockResumeData.header.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiGlobe className="w-4 h-4" />
                    {mockResumeData.header.website}
                  </a>
                </div>
              </div>

              {/* Education & Certification */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiBook className="text-blue-500" />
                  Education & Certification
                </h2>
                {/* Certifications */}
                {mockResumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <FiAward className="w-4 h-4 text-blue-500" />
                    <span className="text-foreground/80">{cert}</span>
                  </div>
                ))}
                {/* Education */}
                <div className="space-y-4 mt-4">
                  {mockResumeData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="pb-4 border-b border-foreground/10 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-foreground/70">
                            {edu.institution} · {edu.location}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-foreground/60 mt-1">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1 sm:mt-0">
                          {edu.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-blue-500" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {mockResumeData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="pb-6 border-b border-foreground/10 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {exp.title}
                          </h3>
                          <p className="text-foreground/70">
                            {exp.company} · {exp.location}
                          </p>
                        </div>
                        <p className="text-sm text-foreground/60 mt-1 sm:mt-0">
                          {exp.date}
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80 mb-3">
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiFolder className="text-blue-500" />
                  Projects
                </h2>
                <div className="space-y-6">
                  {mockResumeData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="pb-6 border-b border-foreground/10 last:border-0"
                    >
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {project.name}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {project.technologies}
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {project.description.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiCode className="text-blue-500" />
                  Technical Skills
                </h2>
                <div className="space-y-4">
                  {mockResumeData.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold text-foreground/70 mb-2">
                        {skillGroup.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-foreground/5 text-foreground/80 border border-foreground/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiStar className="text-blue-500" />
                  Additional
                </h2>
                <ul className="space-y-2">
                  {mockResumeData.additional.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground/80"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          {/* PDF Viewer Placeholder - for future implementation */}
          {/* <motion.div variants={itemVariants} className="mt-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Resume Preview
              </h3>
              <div className="aspect-[8.5/11] bg-foreground/5 rounded-lg flex items-center justify-center">
                <p className="text-foreground/60">
                  PDF viewer will be implemented here
                </p>
              </div>
            </GlassCard>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .glass-card {
            background: white !important;
            backdrop-filter: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
