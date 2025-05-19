import React, { useContext, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import MoodContext from '../context/MoodContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  formatDate,
  getMonthName 
} from '../utils/dateUtils';

// Fixed container with better width control
const CalendarContainer = styled.div`
  margin: 20px auto;
  width: 95%;
  max-width: 460px; 
  background: ${props => props.theme.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px 16px; /* Reduced horizontal padding */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden; /* Prevent overflow */
  
  @media (max-width: 768px) {
    padding: 20px 12px;
    margin: 15px auto;
    width: 90%;
  }
  
  @media (max-width: 480px) {
    padding: 16px 10px;
    border-radius: 16px;
    width: 94%;
    max-width: 380px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const NavigationButton = styled.button`
  background: ${props => props.theme.buttonBackground};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
  
  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
  }
`;

// Fixed weekday header with better spacing
const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Weekday = styled.div`
  padding: 6px 0;
  color: ${props => props.theme.mutedTextColor};
  font-size: 0.8rem;
  
  @media (max-width: 480px) {
    padding: 4px 0;
    font-size: 0.7rem;
  }
`;

// Fixed grid to prevent overflow
const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  width: 100%;
`;

// Fixed day cell sizing
const DayCell = styled(motion.div)`
  position: relative;
  padding-top: 100%; /* Create square cells using padding-top trick */
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.theme.calendarDayBackground};
  color: ${props => props.isCurrentMonth ? props.theme.textColor : props.theme.mutedTextColor};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: visible;
  
  ${props => props.isMoodLogged && `
    background: ${props.moodColor}15;
    border-color: ${props.moodColor}80;
  `}
  
  ${props => props.isToday && `
    border: 1.5px dashed ${props.theme.accentColor};
    font-weight: bold;
  `}
  
  ${props => props.isSelected && `
    border: 1.5px solid ${props.theme.primaryColor};
    transform: scale(1.03);
  `}
  
  &:hover {
    background: ${props => props.theme.calendarDayHoverBackground};
    transform: translateY(-2px);
  }
`;

// Content container for absolute positioning inside cells
const DayCellContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
`;

const DayNumber = styled.span`
  font-size: 0.85rem;
  margin-top: 2px;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-top: 1px;
  }
`;

const MoodIndicator = styled.div`
  font-size: 1rem;
  margin-bottom: 2px;
  cursor: pointer;
  z-index: 5;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1px;
  }
`;

// Standard popup styles
const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  @media (max-width: 480px) {
    align-items: flex-end;
  }
`;

const CenteredPopup = styled(motion.div)`
  background: ${props => props.theme.popupBackground};
  padding: 24px 20px;
  border-radius: 20px;
  width: 300px;
  max-width: 85vw;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    padding: 20px 16px;
  }
`;

const PopupHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }
`;

const PopupContent = styled.div`
  text-align: center;
`;

// Better button controls
const CalendarControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 6px;
`;

const ViewButton = styled.button`
  background: ${props => props.isActive 
    ? props.theme.primaryColor 
    : props.theme.buttonBackground};
  color: ${props => props.isActive 
    ? '#fff' 
    : props.theme.textColor};
  border: none;
  border-radius: 16px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;
  
  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
  
  &:hover {
    background: ${props => props.isActive 
      ? props.theme.primaryColorDark 
      : props.theme.buttonHoverBackground};
  }
`;

const Calendar = () => {
  const { 
    moodData, 
    moods, 
    selectedDate, 
    setSelectedDate,
    activeMonth,
    setActiveMonth,
    activeYear,
    setActiveYear
  } = useContext(MoodContext);
  
  const [calendarDays, setCalendarDays] = useState([]);
  const [popupDay, setPopupDay] = useState(null);
  const [calendarView, setCalendarView] = useState('month'); 
  
  const cellRefs = useRef({});
  
  // Shorter weekday names to save space
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Today's date for highlighting current day
  const today = formatDate(new Date());
  
  // Generate calendar days when month/year changes
  useEffect(() => {
    generateCalendarDays();
  }, [activeMonth, activeYear, calendarView]);
  
  // Close popup when clicking outside a day cell
  useEffect(() => {
    if (!popupDay) return;
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-cell]') && !e.target.closest('.mood-popup')) {
        setPopupDay(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [popupDay]);
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(activeYear, activeMonth);
    const firstDayOfMonth = getFirstDayOfMonth(activeYear, activeMonth);
    
    let days = [];
    
    // Previous month's days
    const prevMonth = activeMonth === 0 ? 11 : activeMonth - 1;
    const prevYear = activeMonth === 0 ? activeYear - 1 : activeYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      const date = new Date(prevYear, prevMonth, day);
      days.push({
        date: formatDate(date),
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(activeYear, activeMonth, day);
      days.push({
        date: formatDate(date),
        day,
        month: activeMonth,
        year: activeYear,
        isCurrentMonth: true
      });
    }
    
    // Next month's days
    const nextMonth = activeMonth === 11 ? 0 : activeMonth + 1;
    const nextYear = activeMonth === 11 ? activeYear + 1 : activeYear;
    
    // Determine if we need 5 or 6 weeks of display
    const totalDaysShown = days.length;
    const totalCells = Math.ceil(totalDaysShown / 7) * 7; // Complete the last week
    const remainingDays = totalCells - totalDaysShown;
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date: formatDate(date),
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false
      });
    }
    
    // For week view, just show the current week
    if (calendarView === 'week') {
      const todayIndex = days.findIndex(d => d.date === today);
      const selectedIndex = days.findIndex(d => d.date === selectedDate);
      const targetIndex = selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : 10;
      
      const weekStartIndex = Math.floor(targetIndex / 7) * 7;
      days = days.slice(weekStartIndex, weekStartIndex + 7);
    }
    
    setCalendarDays(days);
  };
  
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (activeMonth === 0) {
        setActiveYear(activeYear - 1);
        setActiveMonth(11);
      } else {
        setActiveMonth(activeMonth - 1);
      }
    } else {
      if (activeMonth === 11) {
        setActiveYear(activeYear + 1);
        setActiveMonth(0);
      } else {
        setActiveMonth(activeMonth + 1);
      }
    }
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setPopupDay(null);
  };
  
  const toggleDayPopup = (date, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopupDay(popupDay === date ? null : date);
  };
  
  const getMoodForDate = (date) => {
    if (!moodData[date]) return null;
    const moodId = moodData[date].moodId;
    return moods.find(m => m.id === moodId);
  };
  
  const formatDateForDisplay = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10) + 1;
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Popup animations
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", damping: 30, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.2 }
    }
  };
  
  // Mobile popup animations
  const mobilePopupVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      transition: { duration: 0.2 }
    }
  };
  
  const getVariants = () => {
    return window.innerWidth <= 480 ? mobilePopupVariants : popupVariants;
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavigationButton onClick={() => navigateMonth('prev')}>
          &#10094;
        </NavigationButton>
        <MonthTitle>{getMonthName(activeMonth)} {activeYear}</MonthTitle>
        <NavigationButton onClick={() => navigateMonth('next')}>
          &#10095;
        </NavigationButton>
      </CalendarHeader>
      
      <WeekdaysRow>
        {weekdays.map(day => (
          <Weekday key={day}>{day}</Weekday>
        ))}
      </WeekdaysRow>
      
      <DaysGrid>
        {calendarDays.map(({ date, day, isCurrentMonth }) => {
          const mood = getMoodForDate(date);
          return (
            <DayCell
              key={date}
              ref={el => cellRefs.current[date] = el}
              data-cell={date}
              onClick={() => handleDayClick(date)}
                            isCurrentMonth={isCurrentMonth}
              isToday={date === today}
              isSelected={date === selectedDate}
              isMoodLogged={!!mood}
              moodColor={mood?.color}
            >
              <DayCellContent>
                <DayNumber>{day}</DayNumber>
                {mood && (
                  <MoodIndicator 
                    onClick={(e) => toggleDayPopup(date, e)}
                  >
                    {mood.emoji}
                  </MoodIndicator>
                )}
              </DayCellContent>
            </DayCell>
          );
        })}
      </DaysGrid>
      
      <CalendarControls>
        <ViewButton 
          isActive={calendarView === 'month'} 
          onClick={() => setCalendarView('month')}
        >
          Month
        </ViewButton>
        <ViewButton 
          isActive={calendarView === 'week'} 
          onClick={() => setCalendarView('week')}
        >
          Week
        </ViewButton>
      </CalendarControls>

      {/* Popup Modal */}
      <AnimatePresence>
        {popupDay && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupDay(null)}
          >
            <CenteredPopup
              className="mood-popup"
              variants={getVariants()}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <PopupCloseButton onClick={() => setPopupDay(null)}>×</PopupCloseButton>
              {(() => {
                const mood = getMoodForDate(popupDay);
                if (!mood) return null;
                
                return (
                  <PopupContent>
                    <PopupHeader>
                      <h2 style={{
                        color: mood.color,
                        margin: '0 0 8px',
                        fontSize: 'clamp(1.5rem, 5vw, 1.8rem)',
                      }}>
                        {mood.emoji}
                      </h2>
                      <h3 style={{
                        color: mood.color,
                        margin: '0',
                        fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                        fontWeight: '600',
                      }}>
                        {mood.label}
                      </h3>
                    </PopupHeader>
                    
                    <div style={{
                      textAlign: 'left', 
                      margin: '20px 0',
                      padding: '15px',
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: '12px'
                    }}>
                      <div style={{
                        margin: '8px 0', 
                        fontSize: "0.95rem",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{opacity: 0.7}}>📅</span>
                        <span>
                          <strong>Date:</strong> {formatDateForDisplay(popupDay)}
                        </span>
                      </div>
                      
                      <div style={{
                        margin: '12px 0', 
                        fontSize: "0.95rem",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{opacity: 0.7}}>🕒</span>
                        <span>
                          <strong>Time Logged:</strong> {moodData[popupDay]?.timestamp ?
                            new Date(moodData[popupDay].timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            : "Not recorded"}
                        </span>
                      </div>
                      
                      {moodData[popupDay].note && (
                        <div style={{
                          margin: '16px 0 4px 0',
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.5)',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '6px'
                          }}>
                            <span style={{opacity: 0.7}}>📝</span>
                            <strong>Note:</strong>
                          </div>
                          <p style={{
                            margin: '0',
                            fontStyle: 'italic',
                            lineHeight: '1.4',
                            fontSize: "0.9rem",
                            color: 'rgba(0,0,0,0.75)'
                          }}>
                            "{moodData[popupDay].note}"
                          </p>
                        </div>
                      )}
                    </div>
                  </PopupContent>
                );
              })()}
            </CenteredPopup>
          </PopupOverlay>
        )}
      </AnimatePresence>
    </CalendarContainer>
  );
};

export default Calendar;
              