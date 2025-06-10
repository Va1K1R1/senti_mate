import React, { createContext, useContext, useState, useEffect } from 'react';
import DiaryService from '../services/DiaryService';

const DiaryContext = createContext();

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

export const DiaryProvider = ({ children }) => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDiary, setCurrentDiary] = useState(null);

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

  const getDiaryById = async (id) => {
    setLoading(true);
    try {
      const diary = await DiaryService.getDiaryById(id);
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

  const updateDiary = async (id, updatedDiary) => {
    setLoading(true);
    try {
      const updated = await DiaryService.updateDiary(id, updatedDiary);
      setDiaries(
        diaries.map(diary =>
          diary.id === id ? updated : diary
        )
      );
      if (currentDiary && currentDiary.id === id) {
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

  const deleteDiary = async (id) => {
    setLoading(true);
    try {
      await DiaryService.deleteDiary(id);
      setDiaries(diaries.filter(diary => diary.id !== id));
      if (currentDiary && currentDiary.id === id) {
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