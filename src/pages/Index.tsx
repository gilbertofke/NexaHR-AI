import { useEffect } from 'react';
import { useThemeStore } from '../store/theme';

const Index = () => {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on first load
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Welcome to Nexa Interviews
        </h1>
        <p className="text-xl text-white/80">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
