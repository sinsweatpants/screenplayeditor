import Editor from '@/components/editor/editor';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full flex justify-center py-8 px-4 overflow-x-auto">
        <Editor />
      </main>
    </div>
  );
}
