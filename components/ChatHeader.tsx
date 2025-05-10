'use client';

import { useState } from 'react';
import { useAppChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ChatHeader() {
  const { clearChat } = useAppChat();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNewChat = () => {
    clearChat();
  };

  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">Mr. SUZUKI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNewChat}
            title="New Chat"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
      
      {showSettings && (
        <div className="border-t p-4 animate-in slide-in-from-top">
          <p className="text-sm text-muted-foreground">
            Settings panel will be implemented in a future update.
          </p>
        </div>
      )}
    </header>
  );
}