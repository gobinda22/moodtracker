import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { MoodProvider } from './context/MoodContext';
import EmojiSelector from './components/EmojiSelector';
import Calendar from './components/Calendar';
import MoodSummary from './components/MoodSummary';
import InsightsPanel from './components/InsightsPanel';
import MoodAvatar from './components/MoodAvatar';
import OnboardingModal from './components/OnboardingModal';
import { lightTheme, darkTheme } from './styles/themes';
import './styles/global.css';
import backgroundImage from './assets/image1.jpg';

// const AppContainer = ThemeProvider.div`
//   min-height: 100vh;
//   background-image: url(${props => props.backgroundImg});
//   background-size: cover;
//   background-position: center;
//   background-attachment: fixed;
// `;
function App() {
  const [theme, setTheme] = useState('light');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar', 'insights', 'profile'
  
  // Check if it's the user's first visit
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      setShowOnboarding(true);
      localStorage.setItem('firstVisit', 'false');
    }
    
    // Check user's preferred theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <MoodProvider>
        <div className="app-container">
          <div className="bg-elements">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>
        </div>
          {showOnboarding && (
            <OnboardingModal onClose={() => setShowOnboarding(false)} />
          )}
          
          <header>
            <h1>Mood Tracker</h1>
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </header>
          
          <main>
            <EmojiSelector />
            
            <nav className="view-selector">
              <button 
                className={activeView === 'calendar' ? 'active' : ''} 
                onClick={() => setActiveView('calendar')}
              >
                Calendar
              </button>
              <button 
                className={activeView === 'insights' ? 'active' : ''} 
                onClick={() => setActiveView('insights')}
              >
                Insights
              </button>
              <button 
                className={activeView === 'profile' ? 'active' : ''} 
                onClick={() => setActiveView('profile')}
              >
                Profile
              </button>
            </nav>
            
            {activeView === 'calendar' && <Calendar />}
            {activeView === 'insights' && <InsightsPanel />}
            {activeView === 'profile' && (
              <div className="profile-container">
                <MoodAvatar />
                <MoodSummary />
              </div>
            )}
          </main>
        </div>
      </MoodProvider>
    </ThemeProvider>
  );
}

export default App;