import type { Note } from "@/types";
import mockNotesData from "./mockNotes.json";

export type { Note };

export const MOCK_NOTES: Note[] = mockNotesData as Note[];

export default MOCK_NOTES;
