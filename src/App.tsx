import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import LaTeorica from "./pages/LaTeorica";
import LasPracticas from "./pages/LasPracticas";
import AutoescuelasReady2Go from "./pages/AutoescuelasReady2Go";
import AutoescuelaOnline from "./pages/AutoescuelaOnline";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardProfesor from "./pages/DashboardProfesor";
import Pagos from "./pages/Pagos";
import Reservas from "./pages/Reservas";
import Perfil from "./pages/Perfil";
import Blog from "./pages/Blog";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plataforma" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-profesor" element={<DashboardProfesor />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
