import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";
import PoliticaCookies from "./pages/PoliticaCookies";
import Home from "./pages/Home";
import Index from "./pages/Index";
import LaTeorica from "./pages/LaTeorica";
import LasPracticas from "./pages/LasPracticas";
import AutoescuelaPardillo from "./pages/AutoescuelaPardillo";
import AutoescuelaValdemorillo from "./pages/AutoescuelaValdemorillo";
import AutoescuelaOnline from "./pages/AutoescuelaOnline";
import PracticasVirtuales from "./pages/PracticasVirtuales";
import Consejos from "./pages/Consejos";
import Matriculate from "./pages/Matriculate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardProfesor from "./pages/DashboardProfesor";
import Pagos from "./pages/Pagos";
import Reservas from "./pages/Reservas";
import Perfil from "./pages/Perfil";

import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import AvisoLegal from "./pages/AvisoLegal";
import CondicionesContratacion from "./pages/CondicionesContratacion";
import NotFound from "./pages/NotFound";
import PageTitle from "./components/PageTitle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CookieConsentProvider>
          <PageTitle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/plataforma" element={<Index />} />
            <Route path="/la-teorica" element={<LaTeorica />} />
            <Route path="/las-practicas" element={<LasPracticas />} />
            <Route path="/actualidad" element={<PracticasVirtuales />} />
            <Route path="/practicas-virtuales" element={<PracticasVirtuales />} />
            <Route path="/consejos" element={<Consejos />} />
            <Route path="/autoescuelas-ready2go/villanueva-del-pardillo" element={<AutoescuelaPardillo />} />
            <Route path="/autoescuelas-ready2go/valdemorillo" element={<AutoescuelaValdemorillo />} />
            <Route path="/autoescuela-online" element={<AutoescuelaOnline />} />
            <Route path="/matriculate" element={<Matriculate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-profesor" element={<DashboardProfesor />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/perfil" element={<Perfil />} />
            
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/condiciones-contratacion" element={<CondicionesContratacion />} />
            <Route path="/cookies" element={<PoliticaCookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
          <CookieSettingsModal />
          </CookieConsentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
