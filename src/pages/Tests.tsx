import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileQuestion, CheckCircle2, XCircle, TrendingUp, Trophy } from "lucide-react";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type TestListItem = {
  id: string;
  title: string;
  category: string;
  total_questions: number;
  pass_threshold: number;
};

type SafeQuestion = { id: string; text: string; options: string[] };

type SafeTest = {
  id: string;
  title: string;
  category: string;
  total_questions: number;
  pass_threshold: number;
  questions: SafeQuestion[];
};

type AttemptResult = {
  attempt_id: string;
  total_questions: number;
  correct_answers: number;
  errors: number;
  score_percentage: number;
  passed: boolean;
};

type Attempt = {
  id: string;
  test_id: string;
  total_questions: number;
  correct_answers: number;
  errors: number;
  score_percentage: number;
  passed: boolean;
  duration_seconds: number;
  created_at: string;
};

const MINT = "#78FEE1";
const RED = "#ef4444";
const AMBER = "#f59e0b";

function getBarometerColor(value: number) {
  if (value >= 85) return MINT;
  if (value >= 50) return AMBER;
  return RED;
}

function getBarometerLabel(value: number) {
  if (value >= 85) return "Listo para el examen oficial";
  if (value >= 50) return "Sigue practicando";
  return "Necesitas más práctica";
}

function BarometerGauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = getBarometerColor(clamped);
  const [animValue, setAnimValue] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimValue(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  // Semicircle: 180 degrees. Radius
  const r = 100;
  const cx = 120;
  const cy = 120;
  const start = { x: cx - r, y: cy };
  const end = { x: cx + r, y: cy };

  const angle = (animValue / 100) * 180; // 0..180
  const rad = (Math.PI * (180 - angle)) / 180;
  const tip = { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 240 150" className="w-full max-w-[320px]">
        {/* Background arc */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="#0a0a0a"
          strokeOpacity="0.08"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Value arc */}
        {animValue > 0 && (
          <path
            d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${tip.x} ${tip.y}`}
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            style={{ transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        )}
        {/* Center value */}
        <text x={cx} y={cy - 18} textAnchor="middle" className="fill-foreground" fontSize="42" fontWeight="800" fontFamily="Space Grotesk, system-ui">
          {Math.round(clamped)}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-muted-foreground" fontSize="12" fontWeight="500">
          / 100
        </text>
      </svg>
      <p className="mt-2 text-sm font-semibold" style={{ color }}>
        {getBarometerLabel(clamped)}
      </p>
    </div>
  );
}

function TestRunner({
  test,
  onFinish,
  onCancel,
}: {
  test: SafeTest;
  onFinish: (result: AttemptResult) => void;
  onCancel: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const { toast } = useToast();

  const q = test.questions[idx];
  const isLast = idx === test.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const submit = async () => {
    setSubmitting(true);
    try {
      const duration = Math.round((Date.now() - startedAt) / 1000);
      const { data, error } = await supabase.rpc("submit_test_attempt", {
        _test_id: test.id,
        _answers: answers,
        _duration_seconds: duration,
      });
      if (error) throw error;
      onFinish(data as unknown as AttemptResult);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo enviar el test", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!q) return null;

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{test.category}</p>
            <CardTitle className="text-xl">{test.title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Salir
          </Button>
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: MINT }}
            initial={false}
            animate={{ width: `${((idx + 1) / test.questions.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Pregunta {idx + 1} de {test.questions.length} · Respondidas {answeredCount}/{test.questions.length}
        </p>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-semibold mb-6">{q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="pt-1">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between gap-3 mt-8">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
            Anterior
          </Button>
          {!isLast ? (
            <Button onClick={() => setIdx((i) => i + 1)}>Siguiente</Button>
          ) : (
            <Button onClick={submit} disabled={submitting} className="bg-primary hover:bg-primary/90">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Finalizar test
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResultView({
  result,
  passThreshold,
  onBack,
}: {
  result: AttemptResult;
  passThreshold: number;
  onBack: () => void;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-8 pb-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            result.passed ? "bg-accent" : "bg-destructive/10"
          }`}
        >
          {result.passed ? (
            <Trophy className="w-10 h-10 text-primary" />
          ) : (
            <XCircle className="w-10 h-10 text-destructive" />
          )}
        </motion.div>
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-1">
          {result.passed ? "¡Aprobado!" : "Suspenso"}
        </h2>
        <p className="text-muted-foreground mb-6">
          Necesitas {passThreshold} aciertos para aprobar
        </p>
        <p className="text-6xl font-bold font-['Space_Grotesk'] mb-6" style={{ color: getBarometerColor(result.score_percentage) }}>
          {result.score_percentage}%
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-2xl font-bold">{result.total_questions}</p>
            <p className="text-xs text-muted-foreground">Preguntas</p>
          </div>
          <div className="p-3 rounded-xl bg-accent">
            <p className="text-2xl font-bold text-primary">{result.correct_answers}</p>
            <p className="text-xs text-muted-foreground">Aciertos</p>
          </div>
          <div className="p-3 rounded-xl bg-destructive/10">
            <p className="text-2xl font-bold text-destructive">{result.errors}</p>
            <p className="text-xs text-muted-foreground">Errores</p>
          </div>
        </div>
        <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
          Volver a tests
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Tests() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [activeTest, setActiveTest] = useState<SafeTest | null>(null);
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ result: AttemptResult; passThreshold: number } | null>(null);

  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests-list"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_available_tests");
      if (error) throw error;
      return (data ?? []) as TestListItem[];
    },
    enabled: !!user,
  });

  const { data: attempts } = useQuery({
    queryKey: ["test-attempts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as Attempt[];
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    const list = attempts ?? [];
    const total = list.length;
    const passed = list.filter((a) => a.passed).length;
    const failed = total - passed;
    const errorsTotal = list.reduce((s, a) => s + a.errors, 0);

    // Weighted barometer of last 10
    const last10 = list.slice(0, 10); // most recent first
    let barometer = 0;
    if (last10.length > 0) {
      // Most recent weight = N (length), oldest in window weight = 1
      let num = 0;
      let den = 0;
      last10.forEach((a, i) => {
        const weight = last10.length - i;
        num += Number(a.score_percentage) * weight;
        den += weight;
      });
      barometer = den > 0 ? num / den : 0;
    }

    const lineData = list
      .slice(0, 20)
      .reverse()
      .map((a, i) => ({ name: `#${i + 1}`, score: Number(a.score_percentage) }));

    return { total, passed, failed, errorsTotal, barometer, lineData };
  }, [attempts]);

  const handleStart = async (testId: string) => {
    setLoadingTestId(testId);
    try {
      const { data, error } = await supabase.rpc("get_test_for_attempt", { _test_id: testId });
      if (error) throw error;
      setActiveTest(data as unknown as SafeTest);
      setLastResult(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo cargar el test", variant: "destructive" });
    } finally {
      setLoadingTestId(null);
    }
  };

  const handleFinish = (result: AttemptResult) => {
    const passThreshold = activeTest?.pass_threshold ?? 0;
    setLastResult({ result, passThreshold });
    setActiveTest(null);
    qc.invalidateQueries({ queryKey: ["test-attempts", user?.id] });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && role !== "student") return <Navigate to="/dashboard" replace />;

  const passedPct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
  const donutData = [
    { name: "Aprobados", value: stats.passed },
    { name: "Suspensos", value: stats.failed },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al panel</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logoReady2Go} alt="Ready2Go" className="h-9 sm:h-12 w-auto object-contain shrink-0" />
            <span className="text-lg font-bold font-['Space_Grotesk']">Ready2Go</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="bg-primary pb-24 pt-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
        </motion.div>
        <div className="container mx-auto px-4 max-w-5xl relative">
          {profile?.full_name && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
              className="flex justify-end mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/25 rounded-full px-3.5 py-1.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-primary-foreground/90">{profile.full_name}</span>
              </div>
            </motion.div>
          )}
          <motion.h1
            className="text-3xl font-bold text-primary-foreground mb-1 font-['Space_Grotesk']"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            Tests
          </motion.h1>
          <motion.p
            className="text-primary-foreground/70"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            Practica tests y mide tu nivel
          </motion.p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-5xl -mt-16 relative z-10 pb-16 space-y-12">
        {/* Active runner / result overlay */}
        <AnimatePresence mode="wait">
          {activeTest && (
            <motion.div
              key="runner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TestRunner
                test={activeTest}
                onFinish={handleFinish}
                onCancel={() => setActiveTest(null)}
              />
            </motion.div>
          )}
          {!activeTest && lastResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultView
                result={lastResult.result}
                passThreshold={lastResult.passThreshold}
                onBack={() => setLastResult(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!activeTest && !lastResult && (
          <>
            {/* SECCIÓN 1: Tests disponibles */}
            <section>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Tests disponibles</h2>
              {testsLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="border-border/50">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-6" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !tests || tests.length === 0 ? (
                <div>
                  <div className="text-center py-10 mb-6">
                    <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-lg font-semibold">Próximamente disponibles los tests oficiales</p>
                    <p className="text-sm text-muted-foreground mt-1">Estamos preparando el contenido para ti.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="border-border/50">
                        <CardContent className="pt-6">
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-1/2 mb-6" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((t) => (
                    <motion.div
                      key={t.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Card className="border-border/50 h-full flex flex-col">
                        <CardHeader>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {t.category}
                          </p>
                          <CardTitle className="text-lg">{t.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <p className="text-sm text-muted-foreground mb-6">
                            {t.total_questions} preguntas · Aprueba con {t.pass_threshold}
                          </p>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => handleStart(t.id)}
                            disabled={loadingTestId === t.id}
                          >
                            {loadingTestId === t.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Empezar test
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* SECCIÓN 2: Mis estadísticas */}
            <section>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Mis estadísticas</h2>

              {/* Row 1: barometer + KPIs */}
              <div className="grid lg:grid-cols-5 gap-6 mb-6">
                <Card className="border-border/50 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Barómetro de preparación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarometerGauge value={stats.barometer} />
                  </CardContent>
                </Card>

                <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                  <KpiCard label="Tests realizados" value={stats.total} icon={<FileQuestion className="w-6 h-6 text-primary" />} accent />
                  <KpiCard label="Aprobados" value={stats.passed} icon={<CheckCircle2 className="w-6 h-6 text-primary" />} accent />
                  <KpiCard label="Suspensos" value={stats.failed} icon={<XCircle className="w-6 h-6 text-foreground" />} />
                  <KpiCard label="Errores totales" value={stats.errorsTotal} icon={<TrendingUp className="w-6 h-6 text-foreground" />} />
                </div>
              </div>

              {/* Row 2: line + donut */}
              <div className="grid lg:grid-cols-5 gap-6">
                <Card className="border-border/50 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-base">Evolución (últimos 20 intentos)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.lineData.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">
                        Aún no tienes intentos. Empieza un test para ver tu progreso.
                      </p>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.lineData} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 8,
                                fontSize: 12,
                              }}
                            />
                            <ReferenceLine y={85} stroke="#0a0a0a" strokeDasharray="4 4" strokeOpacity={0.5} />
                            <Line type="monotone" dataKey="score" stroke={MINT} strokeWidth={3} dot={{ fill: MINT, r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Aprobados vs suspensos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.total === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">Sin datos todavía.</p>
                    ) : (
                      <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={donutData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              <Cell fill={MINT} />
                              <Cell fill="#0a0a0a" />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 8,
                                fontSize: 12,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-3xl font-bold font-['Space_Grotesk']">{passedPct}%</p>
                          <p className="text-xs text-muted-foreground">aprobados</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
      <Card className="border-border/50 h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent ? "bg-accent" : "bg-muted"}`}>
              {icon}
            </div>
            <div>
              <p className={`text-3xl font-bold font-['Space_Grotesk'] ${accent ? "text-primary" : "text-foreground"}`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
