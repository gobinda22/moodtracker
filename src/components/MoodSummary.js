import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import MoodContext from '../context/MoodContext';
import { motion } from 'framer-motion';
import { calculateMoodFrequency } from '../utils/moodAnalytics';

const SummaryContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.textColor};
`;

const StreakCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 12px;
  background: ${props => props.theme.streakCardBackground};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const StreakEmoji = styled.div`
  font-size: 2rem;
  margin-right: 15px;
`;

const StreakInfo = styled.div`
  flex: 1;
`;

const StreakCount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
`;

const StreakLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.mutedTextColor};
`;

const FrequencyContainer = styled.div`
  margin-top: 20px;
`;

const FrequencyBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const MoodIndicator = styled.div`
  display: flex;
  align-items: center;
  width: 80px;
`;

const MoodEmoji = styled.span`
  font-size: 1.2rem;
  margin-right: 8px;
`;

const MoodName = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.textColor};
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 10px;
  background: ${props => props.theme.progressBarBackground};
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.percentage}%;
`;

const ProgressPercentage = styled.div`
  width: 40px;
  text-align: right;
  font-size: 0.85rem;
  color: ${props => props.theme.mutedTextColor};
  margin-left: 10px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 30px 0;
  color: ${props => props.theme.mutedTextColor};
`;

const MoodSummary = () => {
  const { moodData, moods, streaks } = useContext(MoodContext);
  
  const moodFrequency = useMemo(() => {
    return calculateMoodFrequency(moodData, moods);
  }, [moodData, moods]);
  
  // Sort moods by frequency
  const sortedMoods = useMemo(() => {
    return [...moodFrequency].sort((a, b) => b.count - a.count);
  }, [moodFrequency]);
  
  if (Object.keys(moodData).length === 0) {
    return (
      <SummaryContainer>
        <SectionTitle>Your Mood Summary</SectionTitle>
        <NoDataMessage>
          <p>No mood data yet. Start tracking your mood to see insights!</p>
          <div style={{ fontSize: '2rem', margin: '20px 0' }}>📊 👀</div>
        </NoDataMessage>
      </SummaryContainer>
    );
  }
  
  return (
    <SummaryContainer>
      <SectionTitle>Your Mood Summary</SectionTitle>
      
      <StreakCard>
        <StreakEmoji>🔥</StreakEmoji>
        <StreakInfo>
          <StreakCount>{streaks.current} day{streaks.current !== 1 ? 's' : ''}</StreakCount>
          <StreakLabel>Current streak</StreakLabel>
        </StreakInfo>
        <StreakInfo>
          <StreakCount>{streaks.longest} day{streaks.longest !== 1 ? 's' : ''}</StreakCount>
          <StreakLabel>Longest streak</StreakLabel>
        </StreakInfo>
      </StreakCard>
      
      <FrequencyContainer>
        <SectionTitle>Most Common Moods</SectionTitle>
        
        {sortedMoods.map(item => (
          <FrequencyBar key={item.mood.id}>
            <MoodIndicator>
              <MoodEmoji>{item.mood.emoji}</MoodEmoji>
              <MoodName>{item.mood.label}</MoodName>
            </MoodIndicator>
            <ProgressBarContainer>
              <ProgressBarFill 
                color={item.mood.color}
                percentage={item.percentage}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </ProgressBarContainer>
            <ProgressPercentage>{Math.round(item.percentage)}%</ProgressPercentage>
          </FrequencyBar>
        ))}
      </FrequencyContainer>
    </SummaryContainer>
  );
};

export default MoodSummary;