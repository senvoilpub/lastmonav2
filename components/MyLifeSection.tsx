"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Experience {
  id: string;
  title?: string;
  company?: string;
  period?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Education {
  id: string;
  degree?: string;
  institution?: string;
  period?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Certification {
  id: string;
  name?: string;
  issuer?: string;
  date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface MyLifeSectionProps {
  lang: "en" | "fr";
}

export default function MyLifeSection({ lang }: MyLifeSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Array<{ id: string; skill: string }>>([]);
  const [hobbies, setHobbies] = useState<Array<{ id: string; hobby: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddExpForm, setShowAddExpForm] = useState(false);
  const [showAddEduForm, setShowAddEduForm] = useState(false);
  const [showAddCertForm, setShowAddCertForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    title: "",
    company: "",
    period: "",
    description: "",
  });
  const [newEdu, setNewEdu] = useState<Partial<Education>>({
    degree: "",
    institution: "",
    period: "",
    description: "",
  });
  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const [expRes, eduRes, certRes, skillsRes, hobbiesRes] = await Promise.all([
        fetch("/api/experiences", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
        fetch("/api/life-data/education", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
        fetch("/api/life-data/certifications", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
        fetch("/api/life-data/skills", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
        fetch("/api/life-data/hobbies", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
      ]);

      if (expRes.ok) {
        const expData = await expRes.json();
        setExperiences(expData.experiences || []);
      }
      if (eduRes.ok) {
        const eduData = await eduRes.json();
        setEducation(eduData.education || []);
      }
      if (certRes.ok) {
        const certData = await certRes.json();
        setCertifications(certData.certifications || []);
      }
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData.skills || []);
      }
      if (hobbiesRes.ok) {
        const hobbiesData = await hobbiesRes.json();
        setHobbies(hobbiesData.hobbies || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (exp: Partial<Experience>) => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      if (editingId) {
        const response = await fetch(`/api/experiences/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(exp),
        });

        if (response.ok) {
          setEditingId(null);
          await loadAllData();
        }
      } else {
        const response = await fetch("/api/experiences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ experience: exp }),
        });

        if (response.ok) {
          await loadAllData();
        }
      }
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEducation = async (edu: Partial<Education>) => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      if (editingId) {
        const response = await fetch(`/api/life-data/education/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ education: edu }),
        });

        if (response.ok) {
          setEditingId(null);
          await loadAllData();
        }
      } else {
        const response = await fetch("/api/life-data/education", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ education: edu }),
        });

        if (response.ok) {
          await loadAllData();
        }
      }
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCertification = async (cert: Partial<Certification>) => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      if (editingId) {
        const response = await fetch(`/api/life-data/certifications/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ certification: cert }),
        });

        if (response.ok) {
          setEditingId(null);
          await loadAllData();
        }
      } else {
        const response = await fetch("/api/life-data/certifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ certification: cert }),
        });

        if (response.ok) {
          await loadAllData();
        }
      }
    } catch (error) {
      console.error("Error saving certification:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (
    type: "experiences" | "education" | "certifications" | "skills" | "hobbies",
    id: string
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      let url = "";
      if (type === "experiences") {
        url = `/api/experiences/${id}`;
      } else if (type === "education") {
        url = `/api/life-data/education/${id}`;
      } else if (type === "certifications") {
        url = `/api/life-data/certifications/${id}`;
      } else if (type === "skills") {
        const skill = skills.find((s) => s.id === id);
        if (skill) {
          url = `/api/life-data/skills?skill=${encodeURIComponent(skill.skill)}`;
        }
      } else if (type === "hobbies") {
        const hobby = hobbies.find((h) => h.id === id);
        if (hobby) {
          url = `/api/life-data/hobbies?hobby=${encodeURIComponent(hobby.hobby)}`;
        }
      }

      if (url) {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          await loadAllData();
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch("/api/life-data/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ skill: newSkill.trim() }),
      });

      if (response.ok) {
        setNewSkill("");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleAddHobby = async () => {
    if (!newHobby.trim()) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch("/api/life-data/hobbies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ hobby: newHobby.trim() }),
      });

      if (response.ok) {
        setNewHobby("");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error adding hobby:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          {lang === "en" ? "Loading..." : "Chargement..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            {lang === "en" ? "My Life" : "Ma Vie"}
          </h1>
          <p className="text-sm text-gray-600">
            {lang === "en"
              ? "Your complete profile. Manage all your experiences, education, certifications, skills, and hobbies in one place."
              : "Votre profil complet. Gérez toutes vos expériences, formations, certifications, compétences et loisirs en un seul endroit."}
          </p>
        </div>

        {/* Skills, Certifications, Hobbies - Big Visual Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Skills Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">
                {lang === "en" ? "Skills" : "Compétences"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const input = prompt(lang === "en" ? "Add a skill:" : "Ajouter une compétence:");
                  if (input?.trim()) {
                    setNewSkill(input.trim());
                    setTimeout(() => handleAddSkill(), 100);
                  }
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {lang === "en" ? "+ Add" : "+ Ajouter"}
              </button>
            </div>
            {skills.length === 0 ? (
              <p className="text-sm text-indigo-700/70 text-center py-4">
                {lang === "en" ? "No skills yet" : "Aucune compétence"}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skillItem) => (
                  <div
                    key={skillItem.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-900 rounded-full text-sm font-medium shadow-sm"
                  >
                    <span>{skillItem.skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem("skills", skillItem.id)}
                      className="text-indigo-600 hover:text-indigo-800 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-emerald-900">
                {lang === "en" ? "Certifications" : "Certifications"}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddCertForm(true)}
                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
              >
                {lang === "en" ? "+ Add" : "+ Ajouter"}
              </button>
            </div>
            {showAddCertForm && (
              <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-200">
                <CertificationForm
                  certification={newCert}
                  onChange={setNewCert}
                  onSave={() => {
                    handleSaveCertification(newCert);
                    setNewCert({ name: "", issuer: "", date: "", description: "" });
                    setShowAddCertForm(false);
                  }}
                  onCancel={() => {
                    setShowAddCertForm(false);
                    setNewCert({ name: "", issuer: "", date: "", description: "" });
                  }}
                  saving={saving}
                  lang={lang}
                />
              </div>
            )}
            {certifications.length === 0 && !showAddCertForm ? (
              <p className="text-sm text-emerald-700/70 text-center py-4">
                {lang === "en" ? "No certifications yet" : "Aucune certification"}
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {certifications.slice(0, 5).map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-lg p-2.5 shadow-sm border border-emerald-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-900 truncate">
                          {cert.name || (lang === "en" ? "Untitled" : "Sans titre")}
                        </p>
                        {cert.issuer && (
                          <p className="text-xs text-emerald-700 mt-0.5 truncate">{cert.issuer}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem("certifications", cert.id)}
                        className="text-emerald-600 hover:text-emerald-800 ml-2 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {certifications.length > 5 && (
                  <p className="text-xs text-emerald-700/70 text-center pt-1">
                    {lang === "en"
                      ? `+${certifications.length - 5} more`
                      : `+${certifications.length - 5} de plus`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hobbies Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-900">
                {lang === "en" ? "Hobbies" : "Loisirs"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const input = prompt(lang === "en" ? "Add a hobby:" : "Ajouter un loisir:");
                  if (input?.trim()) {
                    setNewHobby(input.trim());
                    setTimeout(() => handleAddHobby(), 100);
                  }
                }}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                {lang === "en" ? "+ Add" : "+ Ajouter"}
              </button>
            </div>
            {hobbies.length === 0 ? (
              <p className="text-sm text-purple-700/70 text-center py-4">
                {lang === "en" ? "No hobbies yet" : "Aucun loisir"}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobbyItem) => (
                  <div
                    key={hobbyItem.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-purple-900 rounded-full text-sm font-medium shadow-sm"
                  >
                    <span>{hobbyItem.hobby}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem("hobbies", hobbyItem.id)}
                      className="text-purple-600 hover:text-purple-800 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experiences and Education - Full Width Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Experiences Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {lang === "en" ? "Work Experiences" : "Expériences professionnelles"}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddExpForm(true)}
                className="px-3 py-1.5 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                {lang === "en" ? "+ Add" : "+ Ajouter"}
              </button>
            </div>

            {showAddExpForm && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <ExperienceForm
                  experience={newExp}
                  onChange={setNewExp}
                  onSave={() => {
                    handleSaveExperience(newExp);
                    setNewExp({ title: "", company: "", period: "", description: "" });
                    setShowAddExpForm(false);
                  }}
                  onCancel={() => {
                    setShowAddExpForm(false);
                    setNewExp({ title: "", company: "", period: "", description: "" });
                  }}
                  saving={saving}
                  lang={lang}
                />
              </div>
            )}

            {experiences.length === 0 && !showAddExpForm ? (
              <p className="text-sm text-gray-500 text-center py-6">
                {lang === "en"
                  ? "No experiences yet. Add your first experience above or generate a resume to automatically extract experiences."
                  : "Aucune expérience pour le moment. Ajoutez votre première expérience ci-dessus ou générez un CV pour extraire automatiquement les expériences."}
              </p>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {editingId === exp.id ? (
                      <ExperienceEditFormInline
                        experience={exp}
                        onSave={(updated) => {
                          handleSaveExperience(updated);
                        }}
                        onCancel={() => setEditingId(null)}
                        saving={saving}
                        lang={lang}
                      />
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {exp.title || (lang === "en" ? "Untitled" : "Sans titre")}
                            </h3>
                            {exp.company && (
                              <p className="text-sm text-gray-600 mt-0.5">{exp.company}</p>
                            )}
                            {exp.period && (
                              <p className="text-xs text-gray-500 mt-0.5">{exp.period}</p>
                            )}
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line line-clamp-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              type="button"
                              onClick={() => setEditingId(exp.id)}
                              className="px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"
                            >
                              {lang === "en" ? "Edit" : "Modifier"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem("experiences", exp.id)}
                              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded"
                            >
                              {lang === "en" ? "Delete" : "Supprimer"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {lang === "en" ? "Education" : "Formation"}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddEduForm(true)}
                className="px-3 py-1.5 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                {lang === "en" ? "+ Add" : "+ Ajouter"}
              </button>
            </div>

            {showAddEduForm && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <EducationForm
                  education={newEdu}
                  onChange={setNewEdu}
                  onSave={() => {
                    handleSaveEducation(newEdu);
                    setNewEdu({ degree: "", institution: "", period: "", description: "" });
                    setShowAddEduForm(false);
                  }}
                  onCancel={() => {
                    setShowAddEduForm(false);
                    setNewEdu({ degree: "", institution: "", period: "", description: "" });
                  }}
                  saving={saving}
                  lang={lang}
                />
              </div>
            )}

            {education.length === 0 && !showAddEduForm ? (
              <p className="text-sm text-gray-500 text-center py-6">
                {lang === "en" ? "No education entries yet." : "Aucune formation pour le moment."}
              </p>
            ) : (
              <div className="space-y-3">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {editingId === edu.id ? (
                      <EducationEditFormInline
                        education={edu}
                        onSave={(updated) => {
                          handleSaveEducation(updated);
                        }}
                        onCancel={() => setEditingId(null)}
                        saving={saving}
                        lang={lang}
                      />
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {edu.degree || (lang === "en" ? "Untitled" : "Sans titre")}
                            </h3>
                            {edu.institution && (
                              <p className="text-sm text-gray-600 mt-0.5">{edu.institution}</p>
                            )}
                            {edu.period && (
                              <p className="text-xs text-gray-500 mt-0.5">{edu.period}</p>
                            )}
                            {edu.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line line-clamp-2">
                                {edu.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              type="button"
                              onClick={() => setEditingId(edu.id)}
                              className="px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"
                            >
                              {lang === "en" ? "Edit" : "Modifier"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem("education", edu.id)}
                              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded"
                            >
                              {lang === "en" ? "Delete" : "Supprimer"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Components
function ExperienceForm({
  experience,
  onChange,
  onSave,
  onCancel,
  saving,
  lang,
}: {
  experience: Partial<Experience>;
  onChange: (exp: Partial<Experience>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Job Title" : "Poste"}
          </label>
          <input
            type="text"
            value={experience.title || ""}
            onChange={(e) => onChange({ ...experience, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Company" : "Entreprise"}
          </label>
          <input
            type="text"
            value={experience.company || ""}
            onChange={(e) => onChange({ ...experience, company: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Period" : "Période"}
        </label>
        <input
          type="text"
          value={experience.period || ""}
          onChange={(e) => onChange({ ...experience, period: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2020 - Present" : "ex: 2020 - Aujourd'hui"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={experience.description || ""}
          onChange={(e) => onChange({ ...experience, description: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}

function ExperienceEditFormInline({
  experience,
  onSave,
  onCancel,
  saving,
  lang,
}: {
  experience: Experience;
  onSave: (exp: Partial<Experience>) => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  const [edited, setEdited] = useState<Partial<Experience>>({
    title: experience.title || "",
    company: experience.company || "",
    period: experience.period || "",
    description: experience.description || "",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Job Title" : "Poste"}
          </label>
          <input
            type="text"
            value={edited.title || ""}
            onChange={(e) => setEdited({ ...edited, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Company" : "Entreprise"}
          </label>
          <input
            type="text"
            value={edited.company || ""}
            onChange={(e) => setEdited({ ...edited, company: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Period" : "Période"}
        </label>
        <input
          type="text"
          value={edited.period || ""}
          onChange={(e) => setEdited({ ...edited, period: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2020 - Present" : "ex: 2020 - Aujourd'hui"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={edited.description || ""}
          onChange={(e) => setEdited({ ...edited, description: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave({ ...experience, ...edited })}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}

function EducationForm({
  education,
  onChange,
  onSave,
  onCancel,
  saving,
  lang,
}: {
  education: Partial<Education>;
  onChange: (edu: Partial<Education>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Degree" : "Diplôme"}
          </label>
          <input
            type="text"
            value={education.degree || ""}
            onChange={(e) => onChange({ ...education, degree: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Institution" : "Établissement"}
          </label>
          <input
            type="text"
            value={education.institution || ""}
            onChange={(e) => onChange({ ...education, institution: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Period" : "Période"}
        </label>
        <input
          type="text"
          value={education.period || ""}
          onChange={(e) => onChange({ ...education, period: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2015 - 2019" : "ex: 2015 - 2019"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={education.description || ""}
          onChange={(e) => onChange({ ...education, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}

function EducationEditFormInline({
  education,
  onSave,
  onCancel,
  saving,
  lang,
}: {
  education: Education;
  onSave: (edu: Partial<Education>) => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  const [edited, setEdited] = useState<Partial<Education>>({
    degree: education.degree || "",
    institution: education.institution || "",
    period: education.period || "",
    description: education.description || "",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Degree" : "Diplôme"}
          </label>
          <input
            type="text"
            value={edited.degree || ""}
            onChange={(e) => setEdited({ ...edited, degree: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Institution" : "Établissement"}
          </label>
          <input
            type="text"
            value={edited.institution || ""}
            onChange={(e) => setEdited({ ...edited, institution: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Period" : "Période"}
        </label>
        <input
          type="text"
          value={edited.period || ""}
          onChange={(e) => setEdited({ ...edited, period: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2015 - 2019" : "ex: 2015 - 2019"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={edited.description || ""}
          onChange={(e) => setEdited({ ...edited, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave({ ...education, ...edited })}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}

function CertificationForm({
  certification,
  onChange,
  onSave,
  onCancel,
  saving,
  lang,
}: {
  certification: Partial<Certification>;
  onChange: (cert: Partial<Certification>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Certification Name" : "Nom de la certification"}
        </label>
        <input
          type="text"
          value={certification.name || ""}
          onChange={(e) => onChange({ ...certification, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Issuer" : "Organisme"}
        </label>
        <input
          type="text"
          value={certification.issuer || ""}
          onChange={(e) => onChange({ ...certification, issuer: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Date" : "Date"}
        </label>
        <input
          type="text"
          value={certification.date || ""}
          onChange={(e) => onChange({ ...certification, date: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2023" : "ex: 2023"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}
