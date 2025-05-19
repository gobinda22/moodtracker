import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import MoodContext from '../context/MoodContext';
import { motion, AnimatePresence } from 'framer-motion';

const EmojiContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const EmojiGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 400px;
  margin: 0 auto;
`;

const EmojiButton = styled(motion.button)`
  background: ${props => props.theme.cardBackground};
  border: 2px solid ${props => props.color};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 5px;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.color}20, ${props => props.color}40);
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px ${props => props.color}50;
    
    &:before {
      opacity: 1;
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.color}30;
    transition: all 0.3s ease;
  }
  
  &:hover:after {
    bottom: 0;
  }
  
  span.label {
    position: absolute;
    bottom: -25px;
    font-size: 0.8rem;
    color: ${props => props.theme.textColor};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover span.label {
    opacity: 1;
  }
`;

const NoteInput = styled.textarea`
  width: 90%;
  max-width: 350px;
  min-height: 60px;
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.textColor};
  resize: vertical;
  transition: border 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.activeColor || props.theme.primaryColor};
  }
`;

const LogButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  background: ${props => props.activeColor || props.theme.primaryColor};
  color: white;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const FeedbackMessage = styled(motion.div)`
  margin-top: 10px;
  color: ${props => props.theme.successColor};
  font-size: 0.9rem;
`;

const EmojiSelector = () => {
  const { moods, currentNote, setCurrentNote, logMood, selectedDate } = useContext(MoodContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleMoodSelect = (moodId) => {
    const mood = moods.find(m => m.id === moodId);
    setSelectedMood(mood);
  };
  
  const handleLogMood = () => {
    if (!selectedMood) return;
    
    logMood(selectedMood.id);
    setShowFeedback(true);
    
    
    setTimeout(() => {
      setSelectedMood(null);
      setShowFeedback(false);
    }, 2000);
  };
  
  return (
    <EmojiContainer>
      <h2>How are you feeling today?</h2>
      
      <EmojiGrid>
        {moods.map(mood => (
          <EmojiButton
            key={mood.id}
            color={mood.color}
            onClick={() => handleMoodSelect(mood.id)}
            whileTap={{ scale: 0.95 }}
            style={{
              borderWidth: selectedMood?.id === mood.id ? '3px' : '2px',
              transform: selectedMood?.id === mood.id ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {mood.emoji}
            <span className="label">{mood.label}</span>
          </EmojiButton>
        ))}
      </EmojiGrid>
      
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <NoteInput
              placeholder="Add a note about how you're feeling..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              activeColor={selectedMood.color}
            />
            
            <LogButton
              activeColor={selectedMood.color}
              onClick={handleLogMood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log my {selectedMood.label} mood
            </LogButton>
          </motion.div>
        )}
        
        {showFeedback && (
          <FeedbackMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Your mood has been logged! ✅
          </FeedbackMessage>
        )}
      </AnimatePresence>
    </EmojiContainer>
  );
};

export default EmojiSelector;