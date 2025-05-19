import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import MoodContext from '../context/MoodContext';
import { motion } from 'framer-motion';
import { getAverageMood } from '../utils/moodAnalytics';
import { generateGradient } from '../utils/colorUtils';

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
`;

const AvatarCircle = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.gradient || props.theme.avatarBackground};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
`;

const AvatarFace = styled.div`
  font-size: 4rem;
  z-index: 2;
`;

const AvatarRipple = styled(motion.div)`
  position: absolute;
  width: 300%;
  height: 300%;
  top: -100%;
  left: -100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  z-index: 1;
`;

const AvatarName = styled.h2`
  margin: 0;
  color: ${props => props.theme.textColor};
`;

const AvatarDescription = styled.p`
  margin: 10px 0 0;
  color: ${props => props.theme.mutedTextColor};
  max-width: 400px;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  margin: 5px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  background: ${props => props.color || props.theme.primaryColor};
`;

const BadgeContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  color: ${props => props.theme.mutedTextColor};
`;

const MoodAvatar = () => {
  const { moodData, moods } = useContext(MoodContext);
  
  const { averageMood, topMoods, description, badges } = useMemo(() => {
    return getAverageMood(moodData, moods);
  }, [moodData, moods]);
  
  const avatarGradient = useMemo(() => {
    if (!averageMood) return null;
    
    // If we have a dominant mood, use its color for the gradient
    // Otherwise, blend colors from top moods
    const colors = topMoods.length > 0 
      ? topMoods.map(mood => mood.color).slice(0, 2) 
      : [moods[0].color, moods[1].color];
    
    return generateGradient(colors);
  }, [averageMood, topMoods, moods]);
  
  if (Object.keys(moodData).length === 0) {
    return (
      <AvatarContainer>
        <AvatarCircle>
          <AvatarFace>😶</AvatarFace>
        </AvatarCircle>
        <AvatarName>Your Mood Avatar</AvatarName>
        <NoDataMessage>
          Start tracking your moods to see your personalized avatar!
        </NoDataMessage>
      </AvatarContainer>
    );
  }
  
  return (
    <AvatarContainer>
      <AvatarCircle 
        gradient={avatarGradient}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 8 
        }}
      >
        <AvatarRipple
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { 
              repeat: Infinity, 
              duration: 20, 
              ease: "linear" 
            },
            scale: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }
          }}
        />
        <AvatarFace>
          {averageMood ? averageMood.emoji : "😶"}
        </AvatarFace>
      </AvatarCircle>
      
      <AvatarName>
        {averageMood ? averageMood.label : "Neutral"} Mood
      </AvatarName>
      
      <AvatarDescription>
        {description || "Your mood avatar reflects your overall emotional state."}
      </AvatarDescription>
      
      <BadgeContainer>
        {badges.map((badge, index) => (
          <Badge key={index} color={badge.color}>
            {badge.label}
          </Badge>
        ))}
      </BadgeContainer>
    </AvatarContainer>
  );
};

export default MoodAvatar;