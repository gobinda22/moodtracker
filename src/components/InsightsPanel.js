import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import MoodContext from '../context/MoodContext';
import { motion } from 'framer-motion';
import { 
  getMoodByDayOfWeek, 
  getMoodByTimeOfDay,
  getConsecutiveDays
} from '../utils/moodAnalytics';

const InsightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
`;

const InsightCard = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const InsightIcon = styled.div`
  font-size: 1.8rem;
  margin-right: 15px;
`;

const InsightTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.textColor};
`;

const ChartContainer = styled.div`
  height: 200px;
  margin-top: 20px;
  position: relative;
`;

const BarGroup = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100%;
  justify-content: space-between;
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Bar = styled(motion.div)`
  width: 80%;
  max-width: 40px;
  background: ${props => props.color || props.theme.primaryColor};
  border-radius: 8px 8px 0 0;
  position: relative;
`;

const BarLabel = styled.div`
  text-align: center;
  font-size: 0.75rem;
  margin-top: 8px;
  color: ${props => props.theme.mutedTextColor};
`;

const BarEmoji = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
`;

const InsightText = styled.p`
  line-height: 1.5;
  color: ${props => props.theme.textColor};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.mutedTextColor};
`;

const InsightsPanel = () => {
  const { moodData, moods } = useContext(MoodContext);
  
  const moodsByDayOfWeek = useMemo(() => {
    return getMoodByDayOfWeek(moodData, moods);
  }, [moodData, moods]);
  
  const moodsByTimeOfDay = useMemo(() => {
    return getMoodByTimeOfDay(moodData, moods);
  }, [moodData, moods]);
  
  const consecutiveDays = useMemo(() => {
    return getConsecutiveDays(moodData, moods);
  }, [moodData, moods]);
  
  if (Object.keys(moodData).length < 3) {
    return (
      <InsightsContainer>
        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <InsightHeader>
            <InsightIcon>🔍</InsightIcon>
            <InsightTitle>Insights</InsightTitle>
          </InsightHeader>
          <NoDataMessage>
            <p>Not enough data yet to generate insights.</p>
            <p>Track your mood for at least 3 days to see patterns!</p>
          </NoDataMessage>
        </InsightCard>
      </InsightsContainer>
    );
  }
  
  return (
    <InsightsContainer>
      <InsightCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <InsightHeader>
          <InsightIcon>📅</InsightIcon>
          <InsightTitle>Mood by Day of Week</InsightTitle>
        </InsightHeader>
        <InsightText>
          {moodsByDayOfWeek.insight}
        </InsightText>
        <ChartContainer>
          <BarGroup>
            {moodsByDayOfWeek.data.map((day, index) => (
              <BarContainer key={index}>
                <Bar 
                  color={day.mood?.color}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  {day.mood && <BarEmoji>{day.mood.emoji}</BarEmoji>}
                </Bar>
                <BarLabel>{day.label.substring(0, 3)}</BarLabel>
              </BarContainer>
            ))}
          </BarGroup>
        </ChartContainer>
      </InsightCard>
      
      <InsightCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <InsightHeader>
          <InsightIcon>⏰</InsightIcon>
          <InsightTitle>Mood by Time of Day</InsightTitle>
        </InsightHeader>
        <InsightText>
          {moodsByTimeOfDay.insight}
        </InsightText>
        <ChartContainer>
          <BarGroup>
            {moodsByTimeOfDay.data.map((time, index) => (
              <BarContainer key={index}>
                <Bar 
                  color={time.mood?.color}
                  initial={{ height: 0 }}
                  animate={{ height: `${time.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  {time.mood && <BarEmoji>{time.mood.emoji}</BarEmoji>}
                </Bar>
                <BarLabel>{time.label}</BarLabel>
              </BarContainer>
            ))}
          </BarGroup>
        </ChartContainer>
      </InsightCard>
      
      <InsightCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <InsightHeader>
          <InsightIcon>💡</InsightIcon>
          <InsightTitle>Mood Patterns</InsightTitle>
        </InsightHeader>
        <InsightText>
          {consecutiveDays.map((insight, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              {insight}
            </div>
          ))}
          {consecutiveDays.length === 0 && (
            "No distinct patterns detected yet. Keep logging your moods to see interesting patterns!"
          )}
        </InsightText>
      </InsightCard>
    </InsightsContainer>
  );
};

export default InsightsPanel;