'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { getArabicWordSuggestions } from '@/ai/ai-client';
import { classifyDocument, ExtractResult } from '@/lib/screenplay-classifier';
import ScreenplayPreview from './screenplay-preview';
import Ruler from './ruler';
import { Loader2 } from 'lucide-react';

const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;

export default function Editor() {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedText = useDebounce(text, 500);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parsed screenplay structure from classifier
  const [parsed, setParsed] = useState<ExtractResult | null>(null);

  useEffect(() => {
    const trimmed = debouncedText.trim();

    if (!trimmed) {
      setSuggestions([]);
      setParsed(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    if (trimmed.length > 2) {
      setIsLoading(true);
      getArabicWordSuggestions(trimmed)
        .then((results) => {
          if (cancelled) return;
          setSuggestions(results.map((item) => item.text));
        })
        .catch((error) => {
          if (cancelled) return;
          console.error('Suggestion error', error);
          setSuggestions([]);
        })
        .finally(() => {
          if (cancelled) return;
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    try {
      const result = classifyDocument(trimmed.split(/\r?\n/));
      if (!cancelled) {
        setParsed(result);
      }
    } catch (error) {
      if (!cancelled) {
        console.error('Parse error', error);
        setParsed(null);
      }
    }

    return () => {
      cancelled = true;
      setIsLoading(false);
    };
  }, [debouncedText]);

  const handleSuggestionClick = (suggestion: string) => {
    const lastSpaceIndex = text.lastIndexOf(' ');
    const newText = (lastSpaceIndex === -1 ? '' : text.substring(0, lastSpaceIndex + 1)) + suggestion + ' ';
    setText(newText);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-6" suppressHydrationWarning>
      {/* Editor and preview side by side */}
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column: editor */}
        <div
          className="relative bg-card text-card-foreground shadow-lg overflow-hidden"
          style={{ width: `${PAGE_WIDTH_PX}px`, height: `${PAGE_HEIGHT_PX}px` }}
        >
          <Ruler orientation="horizontal" />
          <Ruler orientation="vertical" />
          <Textarea
            ref={textareaRef}
            dir="rtl"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={[
              'w-full h-full resize-none border-0 bg-transparent',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              'font-body text-lg leading-loose',
            ].join(' ')}
            style={{
              paddingTop: '96px',
              paddingBottom: '96px',
              paddingRight: '144px',
              paddingLeft: '96px',
            }}
            placeholder="اكتب السيناريو هنا..."
          />
        </div>

        {/* Column: preview */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="font-headline text-lg mb-3">معاينة التنسيق</h3>
          {parsed ? (
            <ScreenplayPreview data={parsed} />
          ) : (
            <p className="text-muted-foreground">اكتب نصًا لعرض المعاينة…</p>
          )}
        </div>
      </div>

      {/* Suggestions below the grid */}
      <div className="w-full max-w-[1200px] mx-auto">
        <h2 className="text-lg font-headline font-semibold mb-3">اقتراحات الكتابة</h2>
        <div className="min-h-[40px]">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>جارٍ البحث عن اقتراحات...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(s)}
                  className="bg-accent/50 hover:bg-accent border-primary/20"
                >
                  {s}
                </Button>
              ))}
            </div>
          ) : (
            debouncedText.length > 0 && <p className="text-muted-foreground">لا توجد اقتراحات. استمر في الكتابة.</p>
          )}
        </div>
      </div>
    </div>
  );
}
