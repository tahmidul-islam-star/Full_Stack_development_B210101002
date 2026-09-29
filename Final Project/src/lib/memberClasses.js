export const MEMBER_CLASSES = {
  MEMBER: "MEMBER",
  EXECUTIVE_MEMBER: "EXECUTIVE_MEMBER",
};

export const MEMBER_CLASS_LABELS = {
  [MEMBER_CLASSES.MEMBER]: "Member",
  [MEMBER_CLASSES.EXECUTIVE_MEMBER]: "Executive Member",
};

const executiveDesignationKeywords = [
  "president",
  "vice president",
  "general secretary",
  "assistant general secretary",
  "joint secretary",
  "treasurer",
  "additional treasurer",
  "assistant treasurer",
  "organizing secretary",
  "event coordinator",
  "event co-ordinator",
  "media & publicity secretary",
  "publicity secretary",
  "executive member",
];

export function getMemberClassLabel(memberClass) {
  return MEMBER_CLASS_LABELS[memberClass] || MEMBER_CLASS_LABELS.MEMBER;
}

export function isExecutiveDesignation(designation) {
  const normalized = designation?.toLowerCase().trim();
  return Boolean(
    normalized && executiveDesignationKeywords.some((keyword) => normalized.includes(keyword))
  );
}