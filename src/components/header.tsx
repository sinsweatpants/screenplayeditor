import { PenSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <PenSquare className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-headline font-semibold mr-3 text-foreground">
          استوديو النص العربي
        </h1>
      </div>
    </header>
  );
}
