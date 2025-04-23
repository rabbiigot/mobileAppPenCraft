import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Define the type for a note
export type Note = {
  title: string;
  content: string;
  id: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  loadNotes: () => void;
  clearNotes: () => void;
};

// Create a Context with default values
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Create a provider to wrap your app and manage the notes state
export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Omit<Note, 'id'>) => {
  const newNote: Note = {
    id: uuid.v4().toString(), // or use Date.now().toString()
    ...note,
  };

  setNotes((prevNotes) => {
    const updatedNotes = [...prevNotes, newNote];
    AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    console.log(updatedNotes)
    return updatedNotes;
  });
};

  const loadNotes = async () => {
    const storedNotes = await AsyncStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const updatedNotes = prev.filter(note => note.id !== id);
      AsyncStorage.setItem('notes', JSON.stringify(updatedNotes)); // persist the updated notes
      return updatedNotes;
    });
  };

  const clearNotes = async () => {
    await AsyncStorage.removeItem('notes');
    setNotes([]);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, loadNotes ,deleteNote, clearNotes}}>
      {children}
    </NotesContext.Provider>
  );
};

// Create a custom hook to use the Notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
