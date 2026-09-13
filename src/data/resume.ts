import resumeData from "./resume.json";

export type ResumeItem = {
  title: string;
  role: string;
  date: string;
  detail?: string;
  href?: string;
};

export type ResumeSection = {
  title: string;
  items: ResumeItem[];
};

export const resumeProfile = resumeData.profile;
export const resumeSections = resumeData.sections as ResumeSection[];
