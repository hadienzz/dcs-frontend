import type { DocumentDivision, DocumentPic, DocumentSubdivision } from "@/types/document-center";

export const ALL_DIVISIONS_VALUE = "*";

export function getDivisionById(divisions: DocumentDivision[], divisionId: string) {
  return divisions.find((division) => division.id === divisionId);
}

export function getSubdivisionsByDivision(
  divisions: DocumentDivision[],
  divisionId: string,
): DocumentSubdivision[] {
  return getDivisionById(divisions, divisionId)?.subdivisions ?? [];
}

export function getPicsByDivision(
  divisions: DocumentDivision[],
  divisionId: string,
): DocumentPic[] {
  return getDivisionById(divisions, divisionId)?.people ?? [];
}

export function getAllPics(divisions: DocumentDivision[]) {
  return divisions.flatMap((division) => division.people);
}

export function formatDocumentDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
