import React, { createContext, useState, useEffect } from 'react';
import { formatDate, getMonth, getYear } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';



const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [moodData, setMoodData] = useLocalStorage('moodData', {});
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentNote, setCurrentNote] = useState('');
  const [activeMonth, setActiveMonth] = useState(getMonth(new Date()));
  const [activeYear, setActiveYear] = useState(getYear(new Date()));
  const [streaks, setStreaks] = useState({
    current: 0,
    longest: 0,
    lastLoggedDate: null
  });
  
  const moods = [
    { id: 'happy', emoji: '😀', color: '#4CAF50', label: 'Happy' },
    { id: 'excited', emoji: '🤩', color: '#8BC34A', label: 'Excited' },
    { id: 'calm', emoji: '😌', color: '#03A9F4', label: 'Calm' },
    { id: 'neutral', emoji: '😐', color: '#9E9E9E', label: 'Neutral' },
    { id: 'stressed', emoji: '😰', color: '#FFC107', label: 'Stressed' },
    { id: 'sad', emoji: '😢', color: '#2196F3', label: 'Sad' },
    { id: 'angry', emoji: '😡', color: '#F44336', label: 'Angry' }
  ];

  useEffect(() => {
    calculateStreaks();
  }, [moodData]);

  const logMood = (moodId, note = currentNote, date = selectedDate) => {
    const mood = moods.find(m => m.id === moodId);
    if (!mood) return;
    
    setMoodData(prev => ({
      ...prev,
      [date]: {
        moodId,
        note,
        timestamp: new Date().toISOString(),
      }
    }));
    
    setCurrentNote('');
    
    calculateStreaks();
  };
  
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

    if (dates.includes(today) || dates.includes(yesterday)) {
      currentStreak = 1;
      lastDate = dates[dates.length - 1];
      
      for (let i = dates.length - 2; i >= 0; i--) {
        const currDate = new Date(dates[i+1]);
        const prevDate = new Date(dates[i]);
        
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
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
  
  const value = {
    moodData,
    moods,
    selectedDate,
    setSelectedDate,
    currentNote,
    setCurrentNote,
    logMood,
    activeMonth,
    setActiveMonth,
    activeYear,
    setActiveYear,
    streaks
  };
  
  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

export default MoodContext;