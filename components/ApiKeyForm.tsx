'use client';

import { useState } from 'react';
import { useAppChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LockIcon } from 'lucide-react';

export function ApiKeyForm() {
  const { setApiKey } = useAppChat();
  const [inputKey, setInputKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Mr. SUZUKI</CardTitle>
          <CardDescription className="text-center">
            Enter your OpenAI API key to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={isVisible ? "text" : "password"}
                  placeholder="sk-..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {isVisible ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={!inputKey.trim()}>
              <LockIcon className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          Get your API key from the <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">OpenAI dashboard</a>
        </CardFooter>
      </Card>
    </div>
  );
}