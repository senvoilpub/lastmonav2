"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    period?: string;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    period?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
  skills?: string[];
}

const DUMMY_DATA = {
  name: "[Placeholder Name]",
  email: "[placeholder@email.com]",
  phone: "[+1 (555) 000-0000]",
  summary: "[Placeholder professional summary - please provide your experience details]",
  experience: [
    {
      title: "[Placeholder Job Title]",
      company: "[Placeholder Company]",
      period: "[YYYY - YYYY]",
      description: "[Placeholder job description]",
    },
  ],
  education: [
    {
      degree: "[Placeholder Degree]",
      institution: "[Placeholder University]",
      period: "[YYYY - YYYY]",
    },
  ],
  certifications: [
    {
      name: "[Placeholder Certification]",
      issuer: "[Placeholder Issuer]",
      date: "[YYYY]",
    },
  ],
  skills: ["[Placeholder Skill 1]", "[Placeholder Skill 2]"],
};

export default function ResumeDisplay({
  resumeData,
  isLoading,
  mode = "preview",
}: {
  resumeData: ResumeData | null;
  isLoading: boolean;
  mode?: "preview" | "full";
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBlur, setShowBlur] = useState(false);

  useEffect(() => {
    // In preview mode, show blur when there's resume data
    if (mode === "preview") {
    if (resumeData && !isLoading) {
      setShowBlur(true);
      } else {
        setShowBlur(false);
      }
    } else {
      setShowBlur(false);
    }
  }, [resumeData, isLoading, mode]);

  // Prevent scrolling when blur is shown (preview mode only)
  useEffect(() => {
    if (mode !== "preview") return;

    if (contentRef.current && showBlur && !isLoading && resumeData) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const element = contentRef.current;
      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.style.overflow = 'hidden';

      return () => {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('touchmove', handleTouchMove);
        element.style.overflow = '';
      };
    }
  }, [showBlur, isLoading, resumeData, mode]);
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Generating your resume...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-white">
        <p className="text-gray-400 text-center">
          Your generated resume will appear here
        </p>
      </div>
    );
  }

  // Merge with dummy data for missing fields
  const data: ResumeData = {
    name: resumeData.name || DUMMY_DATA.name,
    email: resumeData.email || DUMMY_DATA.email,
    phone: resumeData.phone || DUMMY_DATA.phone,
    summary: resumeData.summary || DUMMY_DATA.summary,
    experience: resumeData.experience && resumeData.experience.length > 0
      ? resumeData.experience
      : DUMMY_DATA.experience,
    education: resumeData.education && resumeData.education.length > 0
      ? resumeData.education
      : DUMMY_DATA.education,
    certifications: resumeData.certifications && resumeData.certifications.length > 0
      ? resumeData.certifications
      : DUMMY_DATA.certifications,
    skills: resumeData.skills && resumeData.skills.length > 0
      ? resumeData.skills
      : DUMMY_DATA.skills,
  };

  // Check if field is placeholder
  const isPlaceholder = (value: string) => {
    return value.includes("[Placeholder") || value.includes("[placeholder");
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-hidden bg-white relative" 
      style={{ 
        fontFamily: "Georgia, 'Times New Roman', serif", 
        height: "100%", 
        maxHeight: "100%",
        minHeight: 0,
        position: "relative"
      }}
    >
      {/* PDF-like container - fixed size with overflow hidden when blur is shown */}
      <div 
        ref={contentRef}
        className={`bg-white shadow-lg p-6 ${
          !isLoading && resumeData && mode === "preview"
            ? "overflow-hidden"
            : "overflow-y-auto"
        }`}
        style={{ 
          height: "100%",
          maxHeight: "100%",
          paddingBottom: !isLoading && resumeData ? "100px" : "24px"
        }}
      >
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-2 mb-3">
          <h1 className={`text-xl font-bold mb-1 ${isPlaceholder(data.name || "") ? "text-gray-400 italic" : "text-gray-900"}`}>
            {data.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-xs text-gray-700">
            <span className={isPlaceholder(data.email || "") ? "text-gray-400 italic" : ""}>
              {data.email}
            </span>
            <span className={isPlaceholder(data.phone || "") ? "text-gray-400 italic" : ""}>
              {data.phone}
            </span>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className={`text-gray-700 text-xs leading-relaxed ${isPlaceholder(data.summary || "") ? "text-gray-400 italic" : ""}`}>
            {data.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Work Experience
          </h2>
          {data.experience?.slice(0, 2).map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className={`font-semibold text-sm ${isPlaceholder(exp.title || "") ? "text-gray-400 italic" : "text-gray-900"}`}>
                    {exp.title}
                  </h3>
                  <p className={`text-gray-700 text-xs ${isPlaceholder(exp.company || "") ? "text-gray-400 italic" : ""}`}>
                    {exp.company}
                  </p>
                </div>
                <span className={`text-xs text-gray-600 whitespace-nowrap ml-2 ${isPlaceholder(exp.period || "") ? "text-gray-400 italic" : ""}`}>
                  {exp.period}
                </span>
              </div>
              <ul className={`list-none space-y-0.5 mt-1 ${isPlaceholder(exp.description || "") ? "text-gray-400 italic" : "text-gray-700"}`}>
                {exp.description?.split("\n").filter(Boolean).map((bullet: string, bulletIdx: number) => {
                  const cleanBullet = bullet.trim().replace(/^[•\-\*]\s*/, "");
                  return (
                    <li key={bulletIdx} className="text-xs leading-relaxed flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>{cleanBullet}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          {data.education?.slice(0, 2).map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-semibold text-xs ${isPlaceholder(edu.degree || "") ? "text-gray-400 italic" : "text-gray-900"}`}>
                    {edu.degree}
                  </h3>
                  <p className={`text-gray-700 text-xs ${isPlaceholder(edu.institution || "") ? "text-gray-400 italic" : ""}`}>
                    {edu.institution}
                  </p>
                </div>
                <span className={`text-xs text-gray-600 whitespace-nowrap ml-2 ${isPlaceholder(edu.period || "") ? "text-gray-400 italic" : ""}`}>
                  {edu.period}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            {data.certifications.slice(0, 2).map((cert, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold text-xs ${isPlaceholder(cert.name || "") ? "text-gray-400 italic" : "text-gray-900"}`}>
                      {cert.name}
                    </h3>
                    <p className={`text-gray-700 text-xs ${isPlaceholder(cert.issuer || "") ? "text-gray-400 italic" : ""}`}>
                      {cert.issuer}
                    </p>
                  </div>
                  <span className={`text-xs text-gray-600 whitespace-nowrap ml-2 ${isPlaceholder(cert.date || "") ? "text-gray-400 italic" : ""}`}>
                    {cert.date}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        <section className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1">
            {data.skills?.slice(0, 8).map((skill, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 bg-blue-50 rounded text-xs ${
                  isPlaceholder(skill) ? "text-gray-400 italic" : "text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
      
      {/* Blur overlay and Sign in button - preview mode only */}
      {!isLoading && resumeData && mode === "preview" && (
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10">
          <div 
            className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-transparent"
            style={{
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)"
            }}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4 pointer-events-auto z-20">
            <Link
              href="/signin"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all"
            >
              Sign in to view your complete resume (free)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
