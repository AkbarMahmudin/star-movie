import { ThemeProvider } from "@/components/theme-provider"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
// import {ModeToggle} from "@/components/mode-toggle.tsx";
import {Route, Routes} from "react-router-dom";
import Dashboard from "@/pages/Dashboard.tsx";
import Movie from "@/pages/Movie.tsx";
import Genre from "@/pages/Genre.tsx";
import NotFound from "@/pages/NotFound.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger />
          {/*<div className="fixed bottom-8 right-8">*/}
          {/*  <ModeToggle/>*/}
          {/*</div>*/}
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/movies" element={<Movie />} />
              <Route path="/genres" element={<Genre />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App