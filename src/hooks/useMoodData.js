import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { formatDate } from '../utils/dateUtils';

export const useMoodData = () => {
  const [moodData, setMoodData] = useLocalStorage('moodData', {});
  const [streaks, setStreaks] = useState({
    current: 0,
    longest: 0,
    lastLoggedDate: null
  });

  // Function to log a mood for a specific date
  const logMood = useCallback((moodId, note = '', date = formatDate(new Date())) => {
    setMoodData(prev => ({
      ...prev,
      [date]: {
        moodId,
        note,
        timestamp: new Date().toISOString(),
      }
    }));
  }, [setMoodData]);

  // Function to delete a mood entry
  const deleteMoodEntry = useCallback((date) => {
    setMoodData(prev => {
      const newData = { ...prev };
      delete newData[date];
      return newData;
    });
  }, [setMoodData]);

  // Function to get a mood entry for a specific date
  const getMoodForDate = useCallback((date) => {
    return moodData[date] || null;
  }, [moodData]);

  // Calculate streaks when mood data changes
  useEffect(() => {
    const calculateStreaks = () => {
      const dates = Object.keys(moodData).sort();
      if (dates.length === 0) {
        setStreaks({ current: 0, longest: 0, lastLoggedDate: null });
        return;
      }
      
      const today = formatDate(new Date());
      const yesterday = formatDate(new Date(Date.now() - 86400000));
      
      let currentStreak = 0;
      let longestStreak = 0;
      let lastDate = null;
      
      // If the most recent entry is today or yesterday, count the streak
      if (dates.includes(today) || dates.includes(yesterday)) {
        currentStreak = 1;
        lastDate = dates[dates.length - 1];
        
        // Count backwards from the most recent entry
        for (let i = dates.length - 2; i >= 0; i--) {
          const currDate = new Date(dates[i+1]);
          const prevDate = new Date(dates[i]);
          
          // Check if days are consecutive
          const diffTime = Math.abs(currDate - prevDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate longest streak
      let tempStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const currDate = new Date(dates[i]);
        const prevDate = new Date(dates[i-1]);
        
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      
      setStreaks({
        current: currentStreak,
        longest: longestStreak,
        lastLoggedDate: lastDate
      });
    };

    calculateStreaks();
  }, [moodData]);

  return {
    moodData,
    logMood,
    deleteMoodEntry,
    getMoodForDate,
    streaks
  };
};