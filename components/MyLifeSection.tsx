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
  const [activeTab, setActiveTab] = useState<
    "experiences" | "education" | "certifications" | "skills" | "hobbies"
  >("experiences");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Array<{ id: string; skill: string }>>([]);
  const [hobbies, setHobbies] = useState<Array<{ id: string; hobby: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      // Load all data in parallel
      const [expRes, eduRes, certRes, skillsRes, hobbiesRes] = await Promise.all([
        fetch("/api/experiences", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        fetch("/api/life-data/education", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        fetch("/api/life-data/certifications", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        fetch("/api/life-data/skills", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        fetch("/api/life-data/hobbies", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
      ]);

      if (expRes.ok) {
        const data = await expRes.json();
        setExperiences(data.experiences || []);
      }
      if (eduRes.ok) {
        const data = await eduRes.json();
        setEducation(data.education || []);
      }
      if (certRes.ok) {
        const data = await certRes.json();
        setCertifications(data.certifications || []);
      }
      if (skillsRes.ok) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: skillsData } = await supabase
            .from("user_skills")
            .select("id, skill")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          setSkills(skillsData?.map((s) => ({ id: s.id, skill: s.skill })) || []);
        }
      }
      if (hobbiesRes.ok) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: hobbiesData } = await supabase
            .from("user_hobbies")
            .select("id, hobby")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          setHobbies(hobbiesData?.map((h) => ({ id: h.id, hobby: h.hobby })) || []);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (exp: Partial<Experience>) => {
    await handleSaveItem("experiences", exp, editingId);
  };

  const handleSaveEducation = async (edu: Partial<Education>) => {
    await handleSaveItem("education", edu, editingId);
  };

  const handleSaveCertification = async (cert: Partial<Certification>) => {
    await handleSaveItem("certifications", cert, editingId);
  };

  const handleSaveItem = async (
    type: "experiences" | "education" | "certifications",
    item: any,
    id: string | null
  ) => {
    try {
      setSaving(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      const endpoint =
        type === "experiences"
          ? "/api/experiences"
          : `/api/life-data/${type}`;

      if (id) {
        // Update
        const response = await fetch(`${endpoint}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          await loadAllData();
          setEditingId(null);
        }
      } else {
        // Create
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ [type.slice(0, -1)]: item }),
        });

        if (response.ok) {
          await loadAllData();
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (
    type: "experiences" | "education" | "certifications" | "skills" | "hobbies",
    id: string
  ) => {
    if (
      !confirm(
        lang === "en"
          ? "Are you sure you want to delete this item?"
          : "Êtes-vous sûr de vouloir supprimer cet élément ?"
      )
    ) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      let endpoint: string;
      if (type === "experiences") {
        endpoint = `/api/experiences/${id}`;
      } else if (type === "skills") {
        // For skills, find the skill by ID and delete by name
        const skillItem = skills.find((s) => s.id === id);
        if (!skillItem) return;
        endpoint = `/api/life-data/skills?skill=${encodeURIComponent(skillItem.skill)}`;
      } else if (type === "hobbies") {
        // For hobbies, find the hobby by ID and delete by name
        const hobbyItem = hobbies.find((h) => h.id === id);
        if (!hobbyItem) return;
        endpoint = `/api/life-data/hobbies?hobby=${encodeURIComponent(hobbyItem.hobby)}`;
      } else {
        endpoint = `/api/life-data/${type}/${id}`;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        await loadAllData();
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

      if (!session?.access_token) {
        return;
      }

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

      if (!session?.access_token) {
        return;
      }

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

  const tabs = [
    { id: "experiences" as const, label: lang === "en" ? "Experiences" : "Expériences" },
    { id: "education" as const, label: lang === "en" ? "Education" : "Formation" },
    { id: "certifications" as const, label: lang === "en" ? "Certifications" : "Certifications" },
    { id: "skills" as const, label: lang === "en" ? "Skills" : "Compétences" },
    { id: "hobbies" as const, label: lang === "en" ? "Hobbies" : "Loisirs" },
  ];

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            {lang === "en" ? "My Life" : "Ma Vie"}
          </h1>
          <p className="text-sm text-gray-600">
            {lang === "en"
              ? "Manage all your personal information in one place. Add experiences, education, certifications, skills, and hobbies."
              : "Gérez toutes vos informations personnelles en un seul endroit. Ajoutez des expériences, formations, certifications, compétences et loisirs."}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {activeTab === "experiences" && (
            <ExperiencesTab
              experiences={experiences}
              onSave={handleSaveExperience}
              onDelete={(id) => handleDeleteItem("experiences", id)}
              editingId={editingId}
              setEditingId={setEditingId}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              saving={saving}
              lang={lang}
            />
          )}

          {activeTab === "education" && (
            <EducationTab
              education={education}
              onSave={handleSaveEducation}
              onDelete={(id) => handleDeleteItem("education", id)}
              editingId={editingId}
              setEditingId={setEditingId}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              saving={saving}
              lang={lang}
            />
          )}

          {activeTab === "certifications" && (
            <CertificationsTab
              certifications={certifications}
              onSave={handleSaveCertification}
              onDelete={(id) => handleDeleteItem("certifications", id)}
              editingId={editingId}
              setEditingId={setEditingId}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              saving={saving}
              lang={lang}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              skills={skills}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              onAdd={handleAddSkill}
              onDelete={(id) => handleDeleteItem("skills", id)}
              lang={lang}
            />
          )}

          {activeTab === "hobbies" && (
            <HobbiesTab
              hobbies={hobbies}
              newHobby={newHobby}
              setNewHobby={setNewHobby}
              onAdd={handleAddHobby}
              onDelete={(id) => handleDeleteItem("hobbies", id)}
              lang={lang}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Experiences Tab Component
function ExperiencesTab({
  experiences,
  onSave,
  onDelete,
  editingId,
  setEditingId,
  showAddForm,
  setShowAddForm,
  saving,
  lang,
}: {
  experiences: Experience[];
  onSave: (exp: Partial<Experience>) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    title: "",
    company: "",
    period: "",
    description: "",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {lang === "en" ? "Work Experiences" : "Expériences professionnelles"}
        </h2>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          >
            {lang === "en" ? "+ Add Experience" : "+ Ajouter une expérience"}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <ExperienceForm
            experience={newExp}
            onChange={setNewExp}
            onSave={() => {
              onSave(newExp);
              setNewExp({ title: "", company: "", period: "", description: "" });
            }}
            onCancel={() => {
              setShowAddForm(false);
              setNewExp({ title: "", company: "", period: "", description: "" });
            }}
            saving={saving}
            lang={lang}
          />
        </div>
      )}

      {experiences.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {lang === "en"
            ? "No experiences yet. Add your first experience above or generate a resume to automatically extract experiences."
            : "Aucune expérience pour le moment. Ajoutez votre première expérience ci-dessus ou générez un CV pour extraire automatiquement les expériences."}
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {editingId === exp.id ? (
                <ExperienceForm
                  experience={exp}
                  onChange={(updated) => {
                    // Handle inline edit
                  }}
                  onSave={(updated) => {
                    onSave(updated);
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
                        <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                      )}
                      {exp.period && (
                        <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                      )}
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => setEditingId(exp.id)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        {lang === "en" ? "Edit" : "Modifier"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(exp.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
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
  );
}

// Experience Form Component
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
  onSave: (exp: Partial<Experience>) => void;
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
          onClick={() => onSave(experience)}
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

// Education Tab Component (similar structure)
function EducationTab({
  education,
  onSave,
  onDelete,
  editingId,
  setEditingId,
  showAddForm,
  setShowAddForm,
  saving,
  lang,
}: {
  education: Education[];
  onSave: (edu: Partial<Education>) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  const [newEdu, setNewEdu] = useState<Partial<Education>>({
    degree: "",
    institution: "",
    period: "",
    description: "",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {lang === "en" ? "Education" : "Formation"}
        </h2>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          >
            {lang === "en" ? "+ Add Education" : "+ Ajouter une formation"}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <EducationForm
            education={newEdu}
            onChange={setNewEdu}
            onSave={() => {
              onSave(newEdu);
              setNewEdu({ degree: "", institution: "", period: "", description: "" });
            }}
            onCancel={() => {
              setShowAddForm(false);
              setNewEdu({ degree: "", institution: "", period: "", description: "" });
            }}
            saving={saving}
            lang={lang}
          />
        </div>
      )}

      {education.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {lang === "en" ? "No education entries yet." : "Aucune formation pour le moment."}
        </p>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {editingId === edu.id ? (
                <EducationForm
                  education={edu}
                  onChange={() => {}}
                  onSave={(updated) => {
                    onSave(updated);
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
                        <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                      )}
                      {edu.period && (
                        <p className="text-xs text-gray-500 mt-1">{edu.period}</p>
                      )}
                      {edu.description && (
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                          {edu.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => setEditingId(edu.id)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        {lang === "en" ? "Edit" : "Modifier"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(edu.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
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
  );
}

// Education Form Component
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
  onSave: (edu: Partial<Education>) => void;
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
          onClick={() => onSave(education)}
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

// Certifications Tab Component
function CertificationsTab({
  certifications,
  onSave,
  onDelete,
  editingId,
  setEditingId,
  showAddForm,
  setShowAddForm,
  saving,
  lang,
}: {
  certifications: Certification[];
  onSave: (cert: Partial<Certification>) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    date: "",
    description: "",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {lang === "en" ? "Certifications" : "Certifications"}
        </h2>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          >
            {lang === "en" ? "+ Add Certification" : "+ Ajouter une certification"}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <CertificationForm
            certification={newCert}
            onChange={setNewCert}
            onSave={() => {
              onSave(newCert);
              setNewCert({ name: "", issuer: "", date: "", description: "" });
            }}
            onCancel={() => {
              setShowAddForm(false);
              setNewCert({ name: "", issuer: "", date: "", description: "" });
            }}
            saving={saving}
            lang={lang}
          />
        </div>
      )}

      {certifications.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {lang === "en" ? "No certifications yet." : "Aucune certification pour le moment."}
        </p>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {editingId === cert.id ? (
                <CertificationForm
                  certification={cert}
                  onChange={() => {}}
                  onSave={(updated) => {
                    onSave(updated);
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
                        {cert.name || (lang === "en" ? "Untitled" : "Sans titre")}
                      </h3>
                      {cert.issuer && (
                        <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                      )}
                      {cert.date && (
                        <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                      )}
                      {cert.description && (
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                          {cert.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => setEditingId(cert.id)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        {lang === "en" ? "Edit" : "Modifier"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(cert.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
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
  );
}

// Certification Form Component
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
  onSave: (cert: Partial<Certification>) => void;
  onCancel: () => void;
  saving: boolean;
  lang: "en" | "fr";
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Date" : "Date"}
        </label>
        <input
          type="text"
          value={certification.date || ""}
          onChange={(e) => onChange({ ...certification, date: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2021" : "ex: 2021"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={certification.description || ""}
          onChange={(e) => onChange({ ...certification, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(certification)}
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

// Skills Tab Component
function SkillsTab({
  skills,
  newSkill,
  setNewSkill,
  onAdd,
  onDelete,
  lang,
}: {
  skills: Array<{ id: string; skill: string }>;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  lang: "en" | "fr";
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {lang === "en" ? "Skills" : "Compétences"}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAdd();
              }
            }}
            placeholder={lang === "en" ? "Add a skill..." : "Ajouter une compétence..."}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={onAdd}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          >
            {lang === "en" ? "Add" : "Ajouter"}
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {lang === "en" ? "No skills yet." : "Aucune compétence pour le moment."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skillItem) => (
            <div
              key={skillItem.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
            >
              <span>{skillItem.skill}</span>
              <button
                type="button"
                onClick={() => onDelete(skillItem.id)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Hobbies Tab Component
function HobbiesTab({
  hobbies,
  newHobby,
  setNewHobby,
  onAdd,
  onDelete,
  lang,
}: {
  hobbies: Array<{ id: string; hobby: string }>;
  newHobby: string;
  setNewHobby: (hobby: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  lang: "en" | "fr";
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {lang === "en" ? "Hobbies" : "Loisirs"}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAdd();
              }
            }}
            placeholder={lang === "en" ? "Add a hobby..." : "Ajouter un loisir..."}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={onAdd}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
          >
            {lang === "en" ? "Add" : "Ajouter"}
          </button>
        </div>
      </div>

      {hobbies.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {lang === "en" ? "No hobbies yet." : "Aucun loisir pour le moment."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobbyItem) => (
            <div
              key={hobbyItem.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
            >
              <span>{hobbyItem.hobby}</span>
              <button
                type="button"
                onClick={() => onDelete(hobbyItem.id)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

