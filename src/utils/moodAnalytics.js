import { getDayOfWeekName, getHourFromDateTime, getTimeOfDay } from './dateUtils';
// Calculate frequency of each mood
export const calculateMoodFrequency = (moodData, moods) => {
  const counts = {};
  let total = 0;
  
  // Count occurrences of each mood
  Object.values(moodData).forEach(entry => {
    if (!counts[entry.moodId]) {
      counts[entry.moodId] = 0;
    }
    counts[entry.moodId]++;
    total++;
  });
  
  // Calculate percentage and create result array with mood details
  return moods.map(mood => {
    const count = counts[mood.id] || 0;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return {
      mood,
      count,
      percentage
    };
  });
};

// Get most common mood by day of week
export const getMoodByDayOfWeek = (moodData, moods) => {
  const dayOfWeekCounts = {
    0: {}, 
    1: {}, 
    2: {}, 
    3: {}, 
    4: {}, 
    5: {}, 
    6: {}  
  };
  
  // Count mood occurrences by day of week
  Object.entries(moodData).forEach(([date, entry]) => {
    const moodId = entry.moodId;
    const dayOfWeek = new Date(date).getDay();
    
    if (!dayOfWeekCounts[dayOfWeek][moodId]) {
      dayOfWeekCounts[dayOfWeek][moodId] = 0;
    }
    
    dayOfWeekCounts[dayOfWeek][moodId]++;
  });
  
  // Find most common mood for each day
  const result = [];
  for (let day = 0; day < 7; day++) {
    const counts = dayOfWeekCounts[day];
    let maxCount = 0;
    let maxMoodId = null;
    let totalForDay = 0;
    
    // Find the mood with highest count
    Object.entries(counts).forEach(([moodId, count]) => {
      totalForDay += count;
      if (count > maxCount) {
        maxCount = count;
        maxMoodId = moodId;
      }
    });
    
    const mood = maxMoodId ? moods.find(m => m.id === maxMoodId) : null;
    const percentage = totalForDay > 0 ? (maxCount / totalForDay) * 100 : 0;
    
    result.push({
      day,
      label: getDayOfWeekName(day),
      mood,
      count: maxCount,
      percentage: totalForDay > 0 ? 100 : 0 
    });
  }
  
  // Generate insight text
  let insight = "No consistent patterns found yet.";
  
  const moodsByDay = result.filter(r => r.mood !== null);
  if (moodsByDay.length > 0) {
    // Find the most consistent day-mood combination
    const bestDay = moodsByDay.sort((a, b) => b.count - a.count)[0];
    
    if (bestDay.count >= 2) {
      insight = `You tend to feel ${bestDay.mood.label.toLowerCase()} on ${bestDay.label}s.`;
      
      // Find happiest and saddest days
      const happyDays = result.filter(r => r.mood?.id === 'happy' || r.mood?.id === 'excited');
      const sadDays = result.filter(r => r.mood?.id === 'sad' || r.mood?.id === 'angry');
      
      if (happyDays.length > 0) {
        const bestHappyDay = happyDays.sort((a, b) => b.count - a.count)[0];
        if (bestHappyDay.count >= 2) {
          insight += ` ${bestHappyDay.label} tends to be your happiest day.`;
        }
      }
      
      if (sadDays.length > 0) {
        const worstDay = sadDays.sort((a, b) => b.count - a.count)[0];
        if (worstDay.count >= 2 && worstDay.label !== bestDay.label) {
          insight += ` ${worstDay.label} is often your most challenging day.`;
        }
      }
    }
  }
  
  return {
    data: result,
    insight
  };
};

// Get most common mood by time of day
export const getMoodByTimeOfDay = (moodData, moods) => {
 
  const timeOfDayCounts = {
    'Morning': {},
    'Afternoon': {},
    'Evening': {},
    'Night': {}
  };
  
  // Count mood occurrences by time of day
  Object.entries(moodData).forEach(([_, entry]) => {
    if (!entry.timestamp) return;
    
    const moodId = entry.moodId;
    const hour = getHourFromDateTime(entry.timestamp);
    const timeOfDay = getTimeOfDay(hour);
    
    if (!timeOfDayCounts[timeOfDay][moodId]) {
      timeOfDayCounts[timeOfDay][moodId] = 0;
    }
    
    timeOfDayCounts[timeOfDay][moodId]++;
  });
  
  // Find most common mood for each time of day
  const result = [];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  timeSlots.forEach(time => {
    const counts = timeOfDayCounts[time];
    let maxCount = 0;
    let maxMoodId = null;
    let totalForTime = 0;
    
    // Find the mood with highest count
    Object.entries(counts).forEach(([moodId, count]) => {
      totalForTime += count;
      if (count > maxCount) {
        maxCount = count;
        maxMoodId = moodId;
      }
    });
    
    const mood = maxMoodId ? moods.find(m => m.id === maxMoodId) : null;
    const percentage = totalForTime > 0 ? (maxCount / totalForTime) * 100 : 0;
    
    result.push({
      time,
      label: time,
      mood,
      count: maxCount,
      percentage: totalForTime > 0 ? 100 : 0 
    });
  });
  
  // Generate insight text
  let insight = "No consistent time of day patterns found yet.";
  
  const moodsByTime = result.filter(r => r.mood !== null);
  if (moodsByTime.length > 0) {
    // Find the most consistent time-mood combination
    const bestTime = moodsByTime.sort((a, b) => b.count - a.count)[0];
    
    if (bestTime.count >= 2) {
      insight = `You typically feel ${bestTime.mood.label.toLowerCase()} during the ${bestTime.time.toLowerCase()}.`;
      
      // Find best and worst times
      const positiveTimes = result.filter(r => 
        r.mood?.id === 'happy' || r.mood?.id === 'excited' || r.mood?.id === 'calm'
      );
      const negativeTimes = result.filter(r => 
        r.mood?.id === 'sad' || r.mood?.id === 'angry' || r.mood?.id === 'stressed'
      );
      
      if (positiveTimes.length > 0) {
        const bestPositiveTime = positiveTimes.sort((a, b) => b.count - a.count)[0];
        if (bestPositiveTime.count >= 2) {
          insight += ` The ${bestPositiveTime.time.toLowerCase()} is often your best time of day.`;
        }
      }
    }
  }
  
  return {
    data: result,
    insight
  };
};

// Identify consecutive days with the same mood
export const getConsecutiveDays = (moodData, moods) => {
  const insights = [];
  const dates = Object.keys(moodData).sort();
  
  if (dates.length < 3) return insights;
  
  // Look for consecutive days with same mood
  let streak = 1;
  let currentMoodId = moodData[dates[0]].moodId;
  let streakStart = dates[0];
  
  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const prevDate = new Date(dates[i-1]);
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1 && moodData[dates[i]].moodId === currentMoodId) {
      streak++;
    } else {
      // If we had a significant streak, add insight
      if (streak >= 3) {
        const mood = moods.find(m => m.id === currentMoodId);
        if (mood) {
          const startDate = new Date(streakStart);
          const endDate = new Date(dates[i-1]);
          
          insights.push(
            `You felt ${mood.label.toLowerCase()} for ${streak} consecutive days from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`
          );
        }
      }
      
      // Reset streak
      streak = 1;
      currentMoodId = moodData[dates[i]].moodId;
      streakStart = dates[i];
    }
  }
  
  // Check final streak
  if (streak >= 3) {
    const mood = moods.find(m => m.id === currentMoodId);
    if (mood) {
      const startDate = new Date(streakStart);
      const endDate = new Date(dates[dates.length - 1]);
      
      insights.push(
        `You've been feeling ${mood.label.toLowerCase()} for ${streak} consecutive days since ${startDate.toLocaleDateString()}.`
      );
    }
  }
  
  return insights;
};

// Get average mood statistics
export const getAverageMood = (moodData, moods) => {
  if (Object.keys(moodData).length === 0) {
    return {
      averageMood: null,
      topMoods: [],
      description: "",
      badges: []
    };
  }
  
  const frequency = calculateMoodFrequency(moodData, moods);
  const sortedMoods = [...frequency].sort((a, b) => b.percentage - a.percentage);
  
  // Get dominant mood
  const dominantMood = sortedMoods[0]?.mood;
  
  // Get top moods
  const topMoods = sortedMoods
    .filter(item => item.count > 0)
    .slice(0, 3)
    .map(item => item.mood);
  
  // Generate description based on mood distribution
  let description = "";
  
  if (sortedMoods[0]?.percentage > 50) {
    description = `You've been predominantly ${dominantMood.label.toLowerCase()} lately.`;
  } else if (sortedMoods[0]?.percentage > 30) {
    description = `You've been mostly ${dominantMood.label.toLowerCase()}, with some variation.`;
  } else {
    description = "Your moods have been varied lately.";
  }
  
  // Generate badges
  const badges = [];
  
  // Tracking streak badge
  const dates = Object.keys(moodData);
  if (dates.length >= 7) {
    badges.push({
      label: "Consistent Tracker",
      color: "#8BC34A"
    });
  }
  
  // Mood diversity badge
  const uniqueMoods = new Set(Object.values(moodData).map(entry => entry.moodId));
  if (uniqueMoods.size >= 4) {
    badges.push({
      label: "Emotionally Aware",
      color: "#9C27B0"
    });
  }
  
  // Positive outlook badge
  const positiveIds = ['happy', 'excited', 'calm'];
  const positiveEntries = Object.values(moodData).filter(entry => 
    positiveIds.includes(entry.moodId)
  );
  
  if (positiveEntries.length > Object.values(moodData).length * 0.6) {
    badges.push({
      label: "Positive Outlook",
      color: "#4CAF50"
    });
  }
  
  return {
    averageMood: dominantMood,
    topMoods,
    description,
    badges
  };
};