import mockNotesData from "./mockNotes.json";

export interface Note {
  id: string;
  title?: string;
  content?: string;
  date: string;
  imageUrl?: string | null;
}

export const MOCK_NOTES: Note[] = mockNotesData as Note[];

export default MOCK_NOTES;
