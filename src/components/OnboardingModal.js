import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  padding: 30px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: ${props => props.theme.textColor};
`;

const ModalDescription = styled.p`
  color: ${props => props.theme.mutedTextColor};
  line-height: 1.6;
  margin-bottom: 25px;
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ProgressDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;
  background: ${props => props.active ? props.theme.primaryColor : props.theme.borderColor};
  transition: background 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.primaryColor};
  color: white;
  box-shadow: 0 4px 10px ${props => props.theme.primaryColor}40;
  
  &:hover {
    background: ${props => props.theme.primaryColorDark};
    box-shadow: 0 6px 12px ${props => props.theme.primaryColor}60;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.textColor};
  
  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
  }
`;

const SkipButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 15px;
  background: transparent;
  color: ${props => props.theme.mutedTextColor};
  font-size: 0.9rem;
  
  &:hover {
    color: ${props => props.theme.textColor};
  }
`;

const IllustrationContainer = styled.div`
  margin: 30px 0;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const EmojiRow = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 320px;
  margin: 0 auto;
  padding: 15px 0;
`;

const EmojiExample = styled.div`
  font-size: 2rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const CalendarExample = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
  max-width: 280px;
  margin: 0 auto;
`;

const CalendarDay = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${props => props.mood ? props.mood : props.theme.calendarDayBackground};
  color: ${props => props.mood ? '#fff' : props.theme.textColor};
`;

const InsightExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsightBar = styled.div`
  height: ${props => props.height || '40px'};
  width: 20px;
  background: ${props => props.color || props.theme.primaryColor};
  border-radius: 4px;
  margin: 0 5px;
`;

const InsightBars = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const OnboardingModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContainer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SkipButton onClick={onClose}>Skip</SkipButton>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <ModalContent>
                <ModalTitle>Welcome to Mood Tracker</ModalTitle>
                <ModalDescription>
                  Track your daily emotions with our intuitive mood tracker. 
                  Just a few taps to log how you're feeling and gain insights about your emotional patterns.
                </ModalDescription>
                
                <IllustrationContainer>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ✨😊✨
                  </motion.div>
                </IllustrationContainer>
              </ModalContent>
            )}
            
            {step === 2 && (
              <ModalContent>
                <ModalTitle>Select Your Mood</ModalTitle>
                <ModalDescription>
                  Simply tap on an emoji that represents how you're feeling. 
                  You can add optional notes to capture the context of your mood.
                </ModalDescription>
                
                <IllustrationContainer>
                  <EmojiRow>
                    {['😀', '😌', '😐', '😢', '😡'].map((emoji, index) => (
                      <EmojiExample 
                        key={index}
                        as={motion.div}
                        whileHover={{ scale: 1.2 }}
                        animate={{ 
                          y: [0, index % 2 === 0 ? -5 : 5, 0] 
                        }}
                        transition={{ 
                          duration: 2,
                          delay: index * 0.2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {emoji}
                      </EmojiExample>
                    ))}
                  </EmojiRow>
                </IllustrationContainer>
              </ModalContent>
            )}
            
            {step === 3 && (
              <ModalContent>
                <ModalTitle>Track Your Progress</ModalTitle>
                <ModalDescription>
                  View your moods on a color-coded calendar. See patterns emerge 
                  over time and track your emotional journey.
                </ModalDescription>
                
                <IllustrationContainer>
                  <CalendarExample>
                    {Array(28).fill().map((_, i) => {
                      // Some sample colored days
                      let mood = null;
                      if (i === 3 || i === 11 || i === 19) mood = '#4CAF50'; // Happy
                      if (i === 6 || i === 20) mood = '#F44336'; // Angry
                      if (i === 15) mood = '#2196F3'; // Sad
                      if (i === 8 || i === 16 || i === 24) mood = '#FFC107'; // Stressed
                      
                      return (
                        <CalendarDay 
                          key={i}
                          mood={mood}
                          as={motion.div}
                          whileHover={{ scale: 1.1 }}
                          animate={mood ? { 
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.01,
                            repeat: mood ? Infinity : 0,
                            repeatType: "reverse"
                          }}
                        >
                          {i + 1}
                        </CalendarDay>
                      );
                    })}
                  </CalendarExample>
                </IllustrationContainer>
              </ModalContent>
            )}
            
            {step === 4 && (
              <ModalContent>
                <ModalTitle>Gain Insights</ModalTitle>
                <ModalDescription>
                  Discover patterns in your mood changes. Learn which days of the week 
                  affect your mood and track your longest streaks of logging.
                </ModalDescription>
                
                <IllustrationContainer>
                  <InsightExample>
                    <InsightBars>
                      <InsightBar height="60px" color="#4CAF50" />
                      <InsightBar height="30px" color="#03A9F4" />
                      <InsightBar height="80px" color="#4CAF50" />
                      <InsightBar height="40px" color="#FFC107" />
                      <InsightBar height="50px" color="#03A9F4" />
                      <InsightBar height="70px" color="#4CAF50" />
                      <InsightBar height="40px" color="#F44336" />
                    </InsightBars>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Mon Tue Wed Thu Fri Sat Sun</div>
                  </InsightExample>
                </IllustrationContainer>
              </ModalContent>
            )}
          </motion.div>
        </AnimatePresence>
        
        <ProgressIndicator>
          {Array(totalSteps).fill().map((_, i) => (
            <ProgressDot key={i} active={i + 1 <= step} />
          ))}
        </ProgressIndicator>
        
        <ButtonContainer>
          {step > 1 ? (
            <SecondaryButton onClick={prevStep}>Back</SecondaryButton>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          <PrimaryButton onClick={nextStep}>
            {step === totalSteps ? "Get Started" : "Next"}
          </PrimaryButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default OnboardingModal;