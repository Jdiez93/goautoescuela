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
        .select("id, full_name, dni, email, phone, city, pack_name, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Matricula[];
    },
    enabled: !!user && (isSecretaria || isAdmin),
  });

  const { data: packs } = useQuery({
    queryKey: ["class-packs-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_packs")
        .select("id, name")
        .eq("is_active", true)
        .order("num_classes");
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
      if (fPack !== "all" && m.pack_name !== fPack) return false;
      return true;
    });
  }, [matriculas, fName, fDni, fCity, fEmail, fPack]);

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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{matriculas?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Filtradas</p>
                <p className="text-2xl font-bold">{filtered.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-accent-foreground">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Package className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Packs</p>
                <p className="text-2xl font-bold">{packs?.length ?? 0}</p>
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
                        <SelectItem key={p.id} value={p.name}>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre y apellidos</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Población</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((m) => (
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
