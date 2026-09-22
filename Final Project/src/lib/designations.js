const designationPriority = [
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
  "member",
  "general member",
];

export function getDesignationRank(designation) {
  if (!designation) return 99;
  const normalized = designation.toLowerCase().trim();

  for (let i = 0; i < designationPriority.length; i++) {
    if (normalized.includes(designationPriority[i])) {
      return i;
    }
  }

  return 50; // Custom designation fallback before general member
}

export function sortByDesignation(members) {
  return [...members].sort((a, b) => {
    const rankA = getDesignationRank(a.designation);
    const rankB = getDesignationRank(b.designation);
    if (rankA !== rankB) return rankA - rankB;
    return (a.name || "").localeCompare(b.name || "");
  });
}
