import { useMemo, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Search,
  Filter,
  LogOut,
  Users,
  Mail,
  IdCard,
  MapPin,
  Package,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Twitter,
  Phone,
  Clock,
  Eye,
  Download,
  FileText,
  Calendar,
  CreditCard,
  Loader2,
} from "lucide-react";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";
import NuevaMatriculaDialog from "@/components/secretaria/NuevaMatriculaDialog";

interface Matricula {
  id: string;
  user_id: string | null;
  full_name: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  date_of_birth: string | null;
  city: string;
  pack_name: string;
  pack_id: string | null;
  precio: number | null;
  status: string;
  estado_matricula: string;
  estado_pago: string;
  contrato_asociado: string | null;
  contrato_firmado_url: string | null;
  dni_anverso_url: string | null;
  dni_reverso_url: string | null;
  fecha_pago: string | null;
  created_at: string;
}


export default function DashboardSecretaria() {
  const { user, profile, isSecretaria, isAdmin, loading, signOut } = useAuth();

  const [fName, setFName] = useState("");
  const [fDni, setFDni] = useState("");
  const [fCity, setFCity] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPack, setFPack] = useState("all");

  const { data: matriculas, isLoading } = useQuery({
    queryKey: ["matriculas-secretaria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matriculas")
        .select(
          "id, user_id, full_name, dni, email, phone, address, postal_code, date_of_birth, city, pack_name, pack_id, precio, status, estado_matricula, estado_pago, contrato_asociado, contrato_firmado_url, dni_anverso_url, dni_reverso_url, fecha_pago, created_at"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Matricula[];
    },
    enabled: !!user && (isSecretaria || isAdmin),
  });

  const queryClient = useQueryClient();

  const userIds = useMemo(
    () => Array.from(new Set((matriculas ?? []).map((m) => m.user_id).filter((id): id is string => !!id))),
    [matriculas]
  );

  const { data: balances } = useQuery({
    queryKey: ["matriculas-balances", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {} as Record<string, number>;
      const { data, error } = await supabase.rpc("secretaria_get_user_balances", { _user_ids: userIds });
      if (error) throw error;
      const map: Record<string, number> = {};
      (data ?? []).forEach((row: { user_id: string; balance: number }) => {
        map[row.user_id] = row.balance;
      });
      return map;
    },
    enabled: !!user && (isSecretaria || isAdmin) && userIds.length > 0,
  });

  const [detail, setDetail] = useState<Matricula | null>(null);
  const [saldoTarget, setSaldoTarget] = useState<Matricula | null>(null);


  const { data: packs } = useQuery({
    queryKey: ["packs-matricula-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packs_matricula")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && (isSecretaria || isAdmin),
  });

  // Sorting
  type SortKey =
    | "full_name"
    | "dni"
    | "email"
    | "phone"
    | "city"
    | "pack_name"
    | "precio"
    | "estado_matricula"
    | "estado_pago"
    | "fecha_pago"
    | "created_at";
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!matriculas) return [];
    const norm = (s: string) => s.toLowerCase().trim();
    return matriculas.filter((m) => {
      if (fName && !norm(m.full_name).includes(norm(fName))) return false;
      if (fDni && !norm(m.dni).includes(norm(fDni))) return false;
      if (fCity && !norm(m.city).includes(norm(fCity))) return false;
      if (fEmail && !norm(m.email).includes(norm(fEmail))) return false;
      if (fPack !== "all") {
        const pack = packs?.find((p) => p.id === fPack);
        const matchesId = m.pack_id === fPack;
        const matchesName = pack ? m.pack_name === pack.name : false;
        if (!matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [matriculas, packs, fName, fDni, fCity, fEmail, fPack]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string | number = (a[sortKey] ?? "") as string;
      let bv: string | number = (b[sortKey] ?? "") as string;
      if (sortKey === "created_at" || sortKey === "fecha_pago") {
        av = a[sortKey] ? new Date(a[sortKey] as string).getTime() : 0;
        bv = b[sortKey] ? new Date(b[sortKey] as string).getTime() : 0;
      } else if (sortKey === "precio") {
        av = a.precio ?? 0;
        bv = b.precio ?? 0;
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);


  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  // Reset to first page when filters/page size change
  useMemo(() => {
    setPage(1);
  }, [fName, fDni, fCity, fEmail, fPack, pageSize]);

  const clearFilters = () => {
    setFName("");
    setFDni("");
    setFCity("");
    setFEmail("");
    setFPack("all");
  };

  const hasFilters = fName || fDni || fCity || fEmail || fPack !== "all";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isSecretaria && !isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16 gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={logoReady2Go} alt="Ready2Go" className="h-9 sm:h-12 w-auto object-contain shrink-0" />
            <span className="text-base sm:text-lg font-bold font-['Space_Grotesk'] truncate">Ready2Go</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span className="text-sm text-primary-foreground/80 hidden md:inline truncate max-w-[160px]">
              {profile?.full_name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground hover:bg-destructive hover:text-destructive-foreground px-2 sm:px-3">
              <LogOut className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-primary pb-16 sm:pb-20 pt-6 sm:pt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
          <div className="absolute bottom-[-80px] left-[-60px] w-[200px] h-[200px] rounded-full border-[30px] border-primary-foreground" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-primary-foreground/70" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">Secretaría</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-1 break-words">
              ¡Hola, {profile?.full_name || "usuario"}!
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/70">
              Gestión de matrículas online realizadas por los alumnos
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-10 flex-1 space-y-8">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 gap-4"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Card className="border-l-4 border-l-primary max-w-md flex-1 min-w-[260px]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Total matrículas</p>
                  <p className="text-2xl font-bold">{matriculas?.length ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <NuevaMatriculaDialog />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5 text-primary" />
                  Filtros de búsqueda
                </CardTitle>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <FilterField
                  label="Nombre y apellidos"
                  icon={<Search className="w-4 h-4" />}
                  value={fName}
                  onChange={setFName}
                  placeholder="Ej: María García"
                />
                <FilterField
                  label="DNI"
                  icon={<IdCard className="w-4 h-4" />}
                  value={fDni}
                  onChange={setFDni}
                  placeholder="12345678A"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Población
                  </Label>
                  <Select value={fCity || "all"} onValueChange={(v) => setFCity(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las poblaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las poblaciones</SelectItem>
                      <SelectItem value="Villanueva del Pardillo">Villanueva del Pardillo</SelectItem>
                      <SelectItem value="Valdemorillo">Valdemorillo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FilterField
                  label="Correo electrónico"
                  icon={<Mail className="w-4 h-4" />}
                  value={fEmail}
                  onChange={setFEmail}
                  placeholder="ejemplo@correo.com"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    Pack elegido
                  </Label>
                  <Select value={fPack} onValueChange={setFPack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los packs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los packs</SelectItem>
                      {packs?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Listado */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Matrículas online
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              {isLoading ? (
                <div className="space-y-3 px-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">
                    {hasFilters
                      ? "No hay matrículas que coincidan con los filtros"
                      : "Aún no hay matrículas registradas"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {hasFilters
                      ? "Prueba a ajustar o limpiar los filtros."
                      : "Las nuevas matrículas online aparecerán aquí automáticamente."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableHead label="Nombre y apellidos" colKey="full_name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="DNI" colKey="dni" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Email" colKey="email" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Población" colKey="city" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Pack" colKey="pack_name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Precio" colKey="precio" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Matrícula" colKey="estado_matricula" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Pago" colKey="estado_pago" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Creada" colKey="created_at" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Pagada" colKey="fecha_pago" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <TableHead className="text-right">Acciones</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginated.map((m) => (
                          <TableRow key={m.id} className="hover:bg-accent/30">
                            <TableCell className="font-medium">{m.full_name}</TableCell>
                            <TableCell className="font-mono text-xs">{m.dni || "—"}</TableCell>
                            <TableCell className="text-sm">{m.email}</TableCell>
                            <TableCell className="text-sm">{m.city || "—"}</TableCell>
                            <TableCell>
                              {m.pack_name ? (
                                <Badge variant="secondary">{m.pack_name}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              {m.precio != null ? formatEuro(m.precio) : "—"}
                            </TableCell>
                            <TableCell>
                              <EstadoMatriculaBadge estado={m.estado_matricula} />
                            </TableCell>
                            <TableCell>
                              <EstadoPagoBadge estado={m.estado_pago} />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(m.created_at)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {m.fecha_pago ? formatDate(m.fecha_pago) : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => setDetail(m)}>
                                <Eye className="w-4 h-4 mr-1" /> Ver
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-0 pt-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        Mostrando{" "}
                        <span className="font-semibold text-foreground">
                          {(currentPage - 1) * pageSize + 1}
                        </span>
                        {"–"}
                        <span className="font-semibold text-foreground">
                          {Math.min(currentPage * pageSize, sorted.length)}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-foreground">{sorted.length}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Por página</Label>
                        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                          <SelectTrigger className="h-8 w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[10, 25, 50, 100].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={currentPage === 1}>
                        <ChevronsLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="px-3 text-sm font-medium">
                        {currentPage} / {totalPages}
                      </span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                        <ChevronsRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MatriculaDetailDialog matricula={detail} onClose={() => setDetail(null)} />


      {/* Compact Footer */}
      <footer className="relative bg-foreground text-background/80 py-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-primary/[0.05] rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <img src={logoReady2Go} alt="Ready2Go" className="h-16 w-auto object-contain" />
                <span className="text-lg font-bold text-background font-['Space_Grotesk'] tracking-tight">Ready2Go</span>
              </div>
              <p className="text-xs leading-relaxed opacity-60 max-w-xs">
                Tu éxito al volante es nuestro compromiso. Como referentes en formación vial digital, ofrecemos un ecosistema de aprendizaje flexible y profesional diseñado para que obtengas tu permiso con la máxima confianza, apoyándote en tecnología avanzada y un equipo humano altamente cualificado.
              </p>
              <div className="mt-3">
                <h4 className="font-semibold text-background mb-2.5 text-[10px] uppercase tracking-[0.2em]">Síguenos</h4>
                <div className="flex items-center gap-2">
                  {[
                    { Icon: Instagram, label: "Instagram", href: "#" },
                    { Icon: Facebook, label: "Facebook", href: "#" },
                    { Icon: Music2, label: "TikTok", href: "#" },
                    { Icon: Youtube, label: "YouTube", href: "#" },
                    { Icon: Twitter, label: "X", href: "#" },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 rounded-lg border border-background/10 bg-background/[0.03] flex items-center justify-center text-background/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-4 text-xs uppercase tracking-[0.2em]">Contacto</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                  <div className="opacity-70">
                    <p className="font-medium text-background/90">V. del Pardillo</p>
                    <p className="text-xs opacity-80">Calle Santa Ana, 1 — 28229</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                  <div className="opacity-70">
                    <p className="font-medium text-background/90">Valdemorillo</p>
                    <p className="text-xs opacity-80">C. Covachuelas, 18 — 28210</p>
                  </div>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-primary/70" />
                  <a href="tel:+34645343117" className="opacity-70 hover:opacity-100 transition-opacity">645 34 31 17</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-primary/70" />
                  <a href="mailto:info@autoescuelago.es" className="opacity-70 hover:opacity-100 transition-opacity">info@autoescuelago.es</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-4 text-xs uppercase tracking-[0.2em]">Horarios</h4>
              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-background/10 bg-background/[0.03] p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="font-semibold text-background/90 text-xs uppercase tracking-wider">V. del Pardillo</p>
                  </div>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Mar y Jue</span>
                    <span className="font-medium text-background/85">11–13 / 17:00–20:00</span>
                  </div>
                </div>
                <div className="rounded-xl border border-background/10 bg-background/[0.03] p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="font-semibold text-background/90 text-xs uppercase tracking-wider">Valdemorillo</p>
                  </div>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Lun, Mié y Vie</span>
                    <span className="font-medium text-background/85">11–13 / 17:00–20:00</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-70 pl-1">
                  <Clock className="w-3.5 h-3.5 text-primary/70" />
                  <span>Prácticas L–V · 8:00 – 22:00</span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-60 pl-1">
                  <span>Sáb y Dom:</span>
                  <span className="text-red-400 font-semibold">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
            <span>© 2026 Ready2Go. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <Link to="/politica-privacidad" className="hover:opacity-100 hover:text-primary transition-all">Política de privacidad</Link>
              <Link to="/aviso-legal" className="hover:opacity-100 hover:text-primary transition-all">Aviso legal</Link>
              <Link to="/condiciones-contratacion" className="hover:opacity-100 hover:text-primary transition-all">Condiciones de contratación</Link>
              <Link to="/cookies" className="hover:opacity-100 hover:text-primary transition-all">Cookies</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center pt-4 mt-4 border-t border-background/10 text-xs opacity-50">
            <span>
              Página desarrollada por{" "}
              <a
                href="https://jdr93portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-primary hover:opacity-100 underline-offset-4 hover:underline transition-all"
              >
                Jorge Díez Rodríguez
              </a>
            </span>
            <span className="hidden sm:inline opacity-50">/</span>
            <a
              href="mailto:jorgediezrodriguez2004@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-primary hover:opacity-100 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              jorgediezrodriguez2004@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FilterField({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pendiente: { label: "Pendiente", className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
    confirmada: { label: "Confirmada", className: "bg-green-500/15 text-green-700 border-green-500/30" },
    cancelada: { label: "Cancelada", className: "bg-red-500/15 text-red-700 border-red-500/30" },
  };
  const item = map[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={item.className}>
      {item.label}
    </Badge>
  );
}

function SortableHead({
  label,
  colKey,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  colKey: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (k: any) => void;
}) {
  const active = sortKey === colKey;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(colKey)}
        className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${
          active ? "text-foreground font-semibold" : ""
        }`}
      >
        {label}
        <Icon className={`w-3.5 h-3.5 ${active ? "opacity-100" : "opacity-50"}`} />
      </button>
    </TableHead>
  );
}

function formatEuro(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EstadoMatriculaBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pendiente_datos: { label: "Pendiente datos", className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
    pendiente_pago: { label: "Pendiente pago", className: "bg-orange-500/15 text-orange-700 border-orange-500/30" },
    pagada: { label: "Pagada", className: "bg-green-500/15 text-green-700 border-green-500/30" },
    completada: { label: "Completada", className: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
    cancelada: { label: "Cancelada", className: "bg-red-500/15 text-red-700 border-red-500/30" },
  };
  const item = map[estado] ?? { label: estado || "—", className: "" };
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}

function EstadoPagoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pendiente: { label: "Pendiente", className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30" },
    pagado: { label: "Pagado", className: "bg-green-500/15 text-green-700 border-green-500/30" },
    fallido: { label: "Fallido", className: "bg-red-500/15 text-red-700 border-red-500/30" },
    reembolsado: { label: "Reembolsado", className: "bg-purple-500/15 text-purple-700 border-purple-500/30" },
  };
  const item = map[estado] ?? { label: estado || "—", className: "" };
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}

function MatriculaDetailDialog({
  matricula,
  onClose,
}: {
  matricula: Matricula | null;
  onClose: () => void;
}) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (path: string | null, label: string) => {
    if (!path) {
      toast({ title: "Archivo no disponible", description: `No hay ${label} subido.`, variant: "destructive" });
      return;
    }
    try {
      setDownloading(path);
      const { data, error } = await supabase.storage
        .from("matriculas")
        .createSignedUrl(path, 60 * 5); // 5 min
      if (error || !data?.signedUrl) throw error ?? new Error("URL no generada");
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      toast({
        title: "No se pudo descargar el archivo",
        description: (err as Error)?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Dialog open={!!matricula} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {matricula && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {matricula.full_name}
              </DialogTitle>
              <DialogDescription>
                Detalle completo de la matrícula registrada el {formatDateTime(matricula.created_at)}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Estados */}
              <div className="flex flex-wrap gap-2">
                <EstadoMatriculaBadge estado={matricula.estado_matricula} />
                <EstadoPagoBadge estado={matricula.estado_pago} />
              </div>

              {/* Datos personales */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Datos personales
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <InfoItem icon={<Users className="w-4 h-4" />} label="Nombre" value={matricula.full_name} />
                  <InfoItem icon={<IdCard className="w-4 h-4" />} label="DNI" value={matricula.dni || "—"} mono />
                  <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={matricula.email} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Teléfono" value={matricula.phone || "—"} />
                  <InfoItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Fecha de nacimiento"
                    value={matricula.date_of_birth ? formatDate(matricula.date_of_birth) : "—"}
                  />
                  <InfoItem icon={<MapPin className="w-4 h-4" />} label="Población" value={matricula.city || "—"} />
                  <InfoItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="Dirección"
                    value={matricula.address || "—"}
                    wide
                  />
                  <InfoItem icon={<MapPin className="w-4 h-4" />} label="Código postal" value={matricula.postal_code || "—"} />
                </dl>
              </section>

              {/* Pack y contrato */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Pack y contrato
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <InfoItem icon={<Package className="w-4 h-4" />} label="Pack elegido" value={matricula.pack_name || "—"} />
                  <InfoItem
                    icon={<CreditCard className="w-4 h-4" />}
                    label="Precio"
                    value={matricula.precio != null ? formatEuro(matricula.precio) : "—"}
                  />
                  <InfoItem
                    icon={<FileText className="w-4 h-4" />}
                    label="Contrato asociado"
                    value={matricula.contrato_asociado || "—"}
                    wide
                  />
                  <InfoItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Fecha de creación"
                    value={formatDateTime(matricula.created_at)}
                  />
                  <InfoItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Fecha de pago"
                    value={matricula.fecha_pago ? formatDateTime(matricula.fecha_pago) : "—"}
                  />
                </dl>
              </section>

              {/* Documentos */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Documentación
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Los enlaces son temporales (5 minutos) y respetan los permisos del almacenamiento privado.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DocButton
                    label="Contrato firmado"
                    path={matricula.contrato_firmado_url}
                    downloading={downloading}
                    onClick={() => handleDownload(matricula.contrato_firmado_url, "contrato firmado")}
                  />
                  <DocButton
                    label="DNI anverso"
                    path={matricula.dni_anverso_url}
                    downloading={downloading}
                    onClick={() => handleDownload(matricula.dni_anverso_url, "DNI anverso")}
                  />
                  <DocButton
                    label="DNI reverso"
                    path={matricula.dni_reverso_url}
                    downloading={downloading}
                    onClick={() => handleDownload(matricula.dni_reverso_url, "DNI reverso")}
                  />
                </div>
              </section>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
  mono,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
        {icon}
        {label}
      </dt>
      <dd className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function DocButton({
  label,
  path,
  downloading,
  onClick,
}: {
  label: string;
  path: string | null;
  downloading: string | null;
  onClick: () => void;
}) {
  const isLoading = !!path && downloading === path;
  const missing = !path;
  return (
    <Button
      type="button"
      variant={missing ? "outline" : "default"}
      disabled={missing || isLoading}
      onClick={onClick}
      className="h-auto py-3 flex-col gap-1.5"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-[10px] opacity-80">
        {missing ? "No disponible" : "Descargar / ver"}
      </span>
    </Button>
  );
}
