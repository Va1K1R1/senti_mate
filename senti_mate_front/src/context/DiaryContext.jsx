import React, { createContext, useContext, useState, useEffect } from 'react';
import DiaryService from '../services/diaryService';

// Create the context
const DiaryContext = createContext();

// Custom hook to use the diary context
export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

/**
 * DiaryProvider component for managing diary entries state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} DiaryProvider component
 */
export const DiaryProvider = ({ children }) => {
  // State for diary entries
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDiary, setCurrentDiary] = useState(null);

  // Load diaries from API on initial render
  useEffect(() => {
    const loadDiaries = async () => {
      setLoading(true);
      try {
        const data = await DiaryService.getAllDiaries();
        setDiaries(data);
      } catch (error) {
        console.error('Error loading diaries:', error);
        setError('Failed to load diary entries');
      } finally {
        setLoading(false);
      }
    };

    loadDiaries();
  }, []);

  // Get a single diary by ID
  const getDiaryById = async (id) => {
    setLoading(true);
    try {
      // Check if id is undefined or invalid
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        setError('Diary ID is required and must be a valid value');
        console.error('Error getting diary: Invalid ID provided', id);
        return null;
      }

      // Ensure id is a number or can be converted to one
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        setError(`Invalid diary ID: ${id} is not a number`);
        console.error(`Error getting diary: Invalid ID format`, id);
        return null;
      }

      const diary = await DiaryService.getDiaryById(diaryId);
      setCurrentDiary(diary);
      return diary;
    } catch (error) {
      console.error('Error getting diary by ID:', error);
      setError('Failed to get diary entry');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new diary entry
  const addDiary = async (diary) => {
    setLoading(true);
    try {
      const newDiary = await DiaryService.createDiary(diary);
      setDiaries([...diaries, newDiary]);
      return newDiary;
    } catch (error) {
      console.error('Error adding diary:', error);
      setError('Failed to add diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing diary entry
  const updateDiary = async (id, updatedDiary) => {
    setLoading(true);
    try {
      // Check if id is undefined or invalid
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        setError('Diary ID is required and must be a valid value for update');
        console.error('Error updating diary: Invalid ID provided', id);
        throw new Error('Diary ID is required and must be a valid value for update');
      }

      // Ensure id is a number or can be converted to one
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        setError(`Invalid diary ID: ${id} is not a number`);
        console.error(`Error updating diary: Invalid ID format`, id);
        throw new Error(`Invalid diary ID: ${id} is not a number`);
      }

      const updated = await DiaryService.updateDiary(diaryId, updatedDiary);
      setDiaries(
        diaries.map(diary =>
          diary.id === diaryId ? updated : diary
        )
      );
      if (currentDiary && currentDiary.id === diaryId) {
        setCurrentDiary(updated);
      }
      return updated;
    } catch (error) {
      console.error('Error updating diary:', error);
      setError('Failed to update diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a diary entry
  const deleteDiary = async (id) => {
    setLoading(true);
    try {
      // Check if id is undefined or invalid
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        setError('Diary ID is required and must be a valid value for deletion');
        console.error('Error deleting diary: Invalid ID provided', id);
        throw new Error('Diary ID is required and must be a valid value for deletion');
      }

      // Ensure id is a number or can be converted to one
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        setError(`Invalid diary ID: ${id} is not a number`);
        console.error(`Error deleting diary: Invalid ID format`, id);
        throw new Error(`Invalid diary ID: ${id} is not a number`);
      }

      await DiaryService.deleteDiary(diaryId);
      setDiaries(diaries.filter(diary => diary.id !== diaryId));
      if (currentDiary && currentDiary.id === diaryId) {
        setCurrentDiary(null);
      }
    } catch (error) {
      console.error('Error deleting diary:', error);
      setError('Failed to delete diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Value object to be provided to consumers
  const value = {
    diaries,
    currentDiary,
    loading,
    error,
    getDiaryById,
    addDiary,
    updateDiary,
    deleteDiary
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};

export default DiaryContext;
