import { useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
} from "lucide-react";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";

interface Matricula {
  id: string;
  full_name: string;
  dni: string;
  email: string;
  phone: string;
  city: string;
  pack_name: string;
  pack_id: string | null;
  status: string;
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
        .select("id, full_name, dni, email, phone, city, pack_name, pack_id, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Matricula[];
    },
    enabled: !!user && (isSecretaria || isAdmin),
  });

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
    | "status"
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
      if (sortKey === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoReady2Go} alt="Ready2Go" className="h-10 w-auto" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/60">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Secretaría</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-foreground">
                {profile?.full_name || "Secretaría"}
              </p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Panel de Secretaría
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestión de matrículas online realizadas por los alumnos.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 gap-4"
        >
          <Card className="border-l-4 border-l-primary max-w-md">
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
                <FilterField
                  label="Población"
                  icon={<MapPin className="w-4 h-4" />}
                  value={fCity}
                  onChange={setFCity}
                  placeholder="Villanueva del Pardillo"
                />
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
                          <SortableHead label="Teléfono" colKey="phone" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Población" colKey="city" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Pack" colKey="pack_name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Estado" colKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                          <SortableHead label="Fecha" colKey="created_at" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginated.map((m) => (
                          <TableRow key={m.id} className="hover:bg-accent/30">
                            <TableCell className="font-medium">{m.full_name}</TableCell>
                            <TableCell className="font-mono text-xs">{m.dni || "—"}</TableCell>
                            <TableCell className="text-sm">{m.email}</TableCell>
                            <TableCell className="text-sm">{m.phone || "—"}</TableCell>
                            <TableCell className="text-sm">{m.city || "—"}</TableCell>
                            <TableCell>
                              {m.pack_name ? (
                                <Badge variant="secondary">{m.pack_name}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={m.status} />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(m.created_at).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
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
