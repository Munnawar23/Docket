import type { Note } from "@/types";

/**
 * Parses note creation or date timestamp into epoch milliseconds.
 * Supports:
 * - numeric `createdAt` timestamps
 * - ISO string `createdAt` (e.g. "2026-09-21T18:30:00.000Z")
 * - "MM/DD" format (e.g. "09/21")
 * - "MM/DD/YYYY" format
 * - Numeric ID fallback
 */
export const parseNoteTimestamp = (note: Note): number => {
  if (typeof note.createdAt === "number") {
    return note.createdAt;
  }
  if (typeof note.createdAt === "string") {
    const parsed = Date.parse(note.createdAt);
    if (!isNaN(parsed)) return parsed;
  }
  if (note.date) {
    const direct = Date.parse(note.date);
    if (!isNaN(direct)) return direct;

    const mmDd = note.date.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (mmDd) {
      const month = parseInt(mmDd[1], 10) - 1;
      const day = parseInt(mmDd[2], 10);
      const currentYear = new Date().getFullYear();
      return new Date(currentYear, month, day).getTime();
    }

    const mmDdYyyy = note.date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmDdYyyy) {
      const month = parseInt(mmDdYyyy[1], 10) - 1;
      const day = parseInt(mmDdYyyy[2], 10);
      const year = parseInt(mmDdYyyy[3], 10);
      return new Date(year, month, day).getTime();
    }
  }

  const numId = Number(note.id);
  if (!isNaN(numId)) return numId;

  return 0;
};

/**
 * Compare two notes chronologically (newest created first).
 */
export const compareNotesByTime = (a: Note, b: Note): number => {
  const timeA = parseNoteTimestamp(a);
  const timeB = parseNoteTimestamp(b);
  if (timeB !== timeA) {
    return timeB - timeA;
  }
  // Tie-breaker: higher ID was created later
  const idA = Number(a.id);
  const idB = Number(b.id);
  if (!isNaN(idA) && !isNaN(idB)) {
    return idB - idA;
  }
  return b.id.localeCompare(a.id);
};

/**
 * Sorts notes array:
 * 1. Pinned notes stay at the top (most recently pinned first, then by time).
 * 2. Unpinned notes are ordered strictly by time (newest created note first).
 * 3. When an unpinned note is restored/unpinned, it returns to its previous chronological place.
 */
export const sortNotes = (notes: Note[]): Note[] => {
  const pinned = notes
    .filter((n) => n.isPinned)
    .sort((a, b) => {
      if (a.pinnedAt && b.pinnedAt && b.pinnedAt !== a.pinnedAt) {
        return b.pinnedAt - a.pinnedAt;
      }
      return compareNotesByTime(a, b);
    });

  const unpinned = notes
    .filter((n) => !n.isPinned)
    .sort(compareNotesByTime);

  return [...pinned, ...unpinned];
};
