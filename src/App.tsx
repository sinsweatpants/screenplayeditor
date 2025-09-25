import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import ScreenplayPage from "@/pages/ScreenplayPage.tsx";
import NotFound from "@/pages/NotFound.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ScreenplayPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
