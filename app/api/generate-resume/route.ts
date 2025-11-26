import { NextRequest, NextResponse } from "next/server";

type Lang = "en" | "fr";

function buildFallbackResume(experience: string, lang: Lang) {
  if (lang === "fr") {
    return {
      name: "Alex Dupont",
      email: "alex.dupont@example.com",
      phone: "+33 6 12 34 56 78",
      summary:
        "Exemple de CV généré automatiquement car trop d’utilisateurs utilisent l’outil en ce moment. Connectez-vous pour générer, modifier et enregistrer votre propre CV à partir de votre expérience réelle.",
      experience: [
        {
          title: "Responsable de projet",
          company: "Entreprise Exemple",
          period: "2019 - Aujourd’hui",
          description:
            "• Gère des projets transverses avec plusieurs équipes métiers et techniques\n" +
            "• Coordonne la planification, le suivi des risques et la communication avec les parties prenantes\n" +
            "• Met en place des tableaux de bord pour suivre les indicateurs clés et améliorer la prise de décision",
        },
      ],
      education: [
        {
          degree: "Master en Management de Projet",
          institution: "Université Exemple",
          period: "2015 - 2017",
        },
      ],
      certifications: [
        {
          name: "Certification Gestion de Projet",
          issuer: "Institut Exemple",
          date: "2021",
        },
      ],
      skills: [
        "Gestion de projet",
        "Communication",
        "Organisation",
        "Travail en équipe",
      ],
    };
  }

  // Default: English
  return {
    name: "Alex Smith",
    email: "alex.smith@example.com",
    phone: "+1 (555) 123-4567",
    summary:
      "Sample resume generated because too many people are using the tool right now. Sign in to generate, edit and save a resume based on your real experience.",
    experience: [
      {
        title: "Product Manager",
        company: "Example Company",
        period: "2019 - Present",
        description:
          "• Lead cross-functional teams to ship product improvements on a regular cadence\n" +
          "• Collect feedback from users and stakeholders to refine roadmap priorities\n" +
          "• Track key metrics and use data to support product decisions",
      },
    ],
    education: [
      {
        degree: "Bachelor of Business Administration",
        institution: "Example University",
        period: "2014 - 2018",
      },
    ],
    certifications: [
      {
        name: "Product Management Certification",
        issuer: "Example Institute",
        date: "2022",
      },
    ],
    skills: ["Product management", "Communication", "Leadership", "Analysis"],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { experience, lang }: { experience?: string; lang?: Lang } =
      await request.json();

    if (!experience || typeof experience !== "string") {
      return NextResponse.json(
        { error: "Experience description is required" },
        { status: 400 }
      );
    }

    const language: Lang = lang === "fr" ? "fr" : "en";

    const apiKey = process.env.GEMINI_API_KEY;
    const languageInstruction =
      language === "fr"
        ? "IMPORTANT: You must write the entire resume in French (FR)."
        : "IMPORTANT: You must write the entire resume in English (EN).";

    // If API key is missing, immediately fall back to a sample resume
    if (!apiKey) {
      const fallback = buildFallbackResume(experience, language);
      return NextResponse.json({ resume: fallback, fallback: true });
    }

    // Call Gemini API - Request JSON output
    const prompt = `Build a professional resume using the following data. IF THE DATA DOESN'T CONCERN RESUME / DOESN'T MAKE SENSE data not related to resume write {0}.

${languageInstruction}

CRITICAL RESUME BEST PRACTICES - You MUST follow these:
1. Use bullet points (•) for all experience descriptions - format as: "• Bullet point 1\\n• Bullet point 2\\n• Bullet point 3"
2. Transform simple statements into professional, achievement-oriented descriptions using:
   - Strong action verbs (Developed, Implemented, Led, Optimized, Designed, etc.)
   - Quantifiable metrics and results (percentages, numbers, timeframes)
   - Impact and outcomes (increased efficiency by X%, reduced costs by Y%, improved performance, etc.)
   - Technical depth and complexity
3. Example transformations:
   - BAD: "built a software in c#"
   - GOOD: "• Developed and deployed a scalable C# application using .NET framework, resulting in 40% improvement in processing efficiency
   • Architected robust software solutions following SOLID principles, reducing system downtime by 25%
   • Collaborated with cross-functional teams to deliver high-quality software products on time and within budget"
4. For each experience, include 3-5 bullet points covering:
   - Key responsibilities and technical work
   - Achievements with metrics when possible
   - Technologies and tools used
   - Impact on business/team/projects
5. Make descriptions professional, specific, and impressive - avoid generic statements
6. Use industry-standard terminology and professional language

IMPORTANT: You must respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "summary": "Professional summary paragraph (2-3 sentences highlighting key achievements and expertise)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Start Date - End Date",
      "description": "• First bullet point with action verb and achievement\\n• Second bullet point with metrics\\n• Third bullet point with impact"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "period": "Start Year - End Year"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Date"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}

Extract information from the user data. Transform all simple descriptions into professional bullet-pointed achievements following resume best practices. If any field is missing, use placeholder data but mark it clearly as placeholder. Here're the data from user: ${experience}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      const fallback = buildFallbackResume(experience, language);
      return NextResponse.json({ resume: fallback, fallback: true });
    }

    const data = await response.json();
    let resumeText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate resume. Please try again.";

    // Check if AI returned {0} indicating invalid/non-resume data
    if (resumeText.trim() === "{0}") {
      return NextResponse.json(
        {
          error:
            "The provided data doesn't appear to be related to a resume. Please provide professional experience, skills, education, or work history.",
        },
        { status: 400 }
      );
    }

    // Try to extract JSON from the response (in case it's wrapped in markdown code blocks)
    const jsonMatch =
      resumeText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ||
      resumeText.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      resumeText = jsonMatch[1];
    }

    // Parse and validate JSON
    let resumeJson;
    try {
      resumeJson = JSON.parse(resumeText);
    } catch (parseError) {
      // If JSON parsing fails, fall back to sample resume
      console.error("Failed to parse JSON:", parseError);
      const fallback = buildFallbackResume(experience, language);
      return NextResponse.json({ resume: fallback, fallback: true });
    }

    return NextResponse.json({ resume: resumeJson, fallback: false });
  } catch (error) {
    console.error("Error generating resume:", error);
    // Any unexpected error -> fall back to a sample resume
    const fallback = buildFallbackResume(
      "",
      "en" // default to English if we can't read body
    );
    return NextResponse.json({ resume: fallback, fallback: true });
  }
}

