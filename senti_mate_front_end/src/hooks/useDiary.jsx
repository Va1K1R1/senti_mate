import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for managing diary entries with CRUD operations
 * @param {number|string} id - Optional diary entry ID for fetching a specific entry
 * @returns {Object} Diary data and CRUD operations
 */
const useDiary = (id = null) => {
  // Use localStorage to persist diary entries
  const [diaries, setDiaries] = useLocalStorage('diaries', [
    {
      id: 1,
      date: new Date().getTime(),
      emotionId: 2,
      content: '오늘은 기분이 좋았다. React 공부도 열심히 했음.',
    },
    {
      id: 2,
      date: new Date().getTime() - 86400000,
      emotionId: 4,
      content: '어제는 좀 우울했지만 친구와 이야기해서 나아졌다.',
    },
  ]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch a specific diary entry by ID
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      try {
        const diary = diaries.find(it => String(it.id) === String(id));
        setData(diary || null);
      } catch (err) {
        setError('Failed to fetch diary entry');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setData(null);
    }
  }, [id, diaries]);

  // Get all diary entries
  const getAllDiaries = useCallback(() => {
    return diaries;
  }, [diaries]);

  // Create a new diary entry
  const createDiary = useCallback(
    newDiary => {
      setLoading(true);
      setError(null);

      try {
        // Generate a new ID (in a real app, this would come from the backend)
        const newId = Math.max(0, ...diaries.map(d => d.id)) + 1;

        const diaryToAdd = {
          ...newDiary,
          id: newId,
          date: newDiary.date || new Date().getTime(),
        };

        setDiaries([...diaries, diaryToAdd]);
        return diaryToAdd;
      } catch (err) {
        setError('Failed to create diary entry');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [diaries, setDiaries],
  );

  // Update an existing diary entry
  const updateDiary = useCallback(
    (id, updatedDiary) => {
      setLoading(true);
      setError(null);

      try {
        const index = diaries.findIndex(d => String(d.id) === String(id));

        if (index === -1) {
          throw new Error(`Diary with id ${id} not found`);
        }

        const updatedDiaries = [...diaries];
        updatedDiaries[index] = { ...updatedDiaries[index], ...updatedDiary };

        setDiaries(updatedDiaries);
        return updatedDiaries[index];
      } catch (err) {
        setError('Failed to update diary entry');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [diaries, setDiaries],
  );

  // Delete a diary entry
  const deleteDiary = useCallback(
    id => {
      setLoading(true);
      setError(null);

      try {
        const filteredDiaries = diaries.filter(
          d => String(d.id) !== String(id),
        );

        if (filteredDiaries.length === diaries.length) {
          throw new Error(`Diary with id ${id} not found`);
        }

        setDiaries(filteredDiaries);
        return true;
      } catch (err) {
        setError('Failed to delete diary entry');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [diaries, setDiaries],
  );

  return {
    data,
    loading,
    error,
    getAllDiaries,
    createDiary,
    updateDiary,
    deleteDiary,
  };
};

export default useDiary;
