import type { StyleProp, ViewStyle } from "react-native";

export interface Note {
  id: string;
  title?: string;
  content?: string;
  date: string;
  imageUrl?: string | null;
  isPinned?: boolean;
  isArchived?: boolean;
}

export type NoteActionType = "delete" | "pin" | "archive";

export interface NoteSelectionState {
  selectedNoteIds: string[];
  isSelectionMode: boolean;
}

export interface NoteCardProps {
  note: Note;
  index?: number;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onPress?: (note: Note) => void;
  onLongPress?: (note: Note) => void;
  style?: StyleProp<ViewStyle>;
}

export interface NotesListScreenProps {
  notes?: Note[];
  selectedNoteIds?: string[];
  isSelectionMode?: boolean;
  onToggleSelectNote?: (note: Note) => void;
  onLongPressNote?: (note: Note) => void;
  onNotePress?: (note: Note) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
