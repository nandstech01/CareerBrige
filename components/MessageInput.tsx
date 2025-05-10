'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useAppChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, MicroscopeIcon as MicrophoneIcon } from 'lucide-react';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, isLoading } = useAppChat();

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      addMessage(message);
      setMessage('');
      
      // Focus the textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-screen-md">
        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Mr. SUZUKI..."
            className="min-h-[50px] resize-none pr-16 py-3 max-h-[200px]"
            maxLength={4000}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8"
              disabled
              title="Voice input (coming soon)"
            >
              <MicrophoneIcon className="h-5 w-5" />
              <span className="sr-only">Voice Input</span>
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              size="icon"
              className="h-8 w-8"
              disabled={!message.trim() || isLoading}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send Message</span>
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          Mr. SUZUKI may produce inaccurate information about people, places, or facts.
        </div>
      </div>
    </div>
  );
}