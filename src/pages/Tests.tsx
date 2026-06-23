import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  FileQuestion,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Trophy,
  GraduationCap,
  Timer,
  BookOpen,
  Sparkles,
  Target,
  Flame,
} from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
type StudyQuestion = SafeQuestion & { correct_index: number };

type SafeTest = {
  id: string;
  title: string;
  category: string;
  total_questions: number;
  pass_threshold: number;
  questions: SafeQuestion[];
};

type StudyTest = Omit<SafeTest, "questions"> & { questions: StudyQuestion[] };

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

type AnswerRow = {
  question_id: string;
  question_text: string;
  is_correct: boolean;
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
  const r = 100, cx = 120, cy = 120;
  const start = { x: cx - r, y: cy };
  const end = { x: cx + r, y: cy };
  const angle = (animValue / 100) * 180;
  const rad = (Math.PI * (180 - angle)) / 180;
  const tip = { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 240 150" className="w-full max-w-[320px]">
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke="#0a0a0a" strokeOpacity="0.08" strokeWidth="18" strokeLinecap="round" />
        {animValue > 0 && (
          <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${tip.x} ${tip.y}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" style={{ transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)" }} />
        )}
        <text x={cx} y={cy - 18} textAnchor="middle" className="fill-foreground" fontSize="42" fontWeight="800" fontFamily="Space Grotesk, system-ui">{Math.round(clamped)}</text>
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-muted-foreground" fontSize="12" fontWeight="500">/ 100</text>
      </svg>
      <p className="mt-2 text-sm font-semibold" style={{ color }}>{getBarometerLabel(clamped)}</p>
    </div>
  );
}

// ============================================================
// STREAK (3 tests/día → 1 día de racha)
// ============================================================
const DAILY_GOAL = 3;

function localDayKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeStreak(attempts: { created_at: string }[]) {
  const counts = new Map<string, number>();
  attempts.forEach((a) => {
    const k = localDayKey(a.created_at);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  });
  const todayKey = localDayKey(new Date().toISOString());
  const todayCount = counts.get(todayKey) ?? 0;
  const todayQualifies = todayCount >= DAILY_GOAL;

  // Count back consecutive qualifying days from today (or yesterday if today not yet qualified)
  let streak = 0;
  const cursor = new Date();
  if (!todayQualifies) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const k = localDayKey(cursor.toISOString());
    if ((counts.get(k) ?? 0) >= DAILY_GOAL) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return { streak, todayCount, todayQualifies };
}

function StreakBadge({ attempts }: { attempts: { created_at: string }[] | undefined }) {
  const { streak, todayCount, todayQualifies } = useMemo(
    () => computeStreak(attempts ?? []),
    [attempts],
  );
  const active = streak > 0;
  const progress = Math.min(todayCount, DAILY_GOAL);
  const remaining = Math.max(0, DAILY_GOAL - todayCount);
  const tip = active
    ? todayQualifies
      ? `¡Racha activa! Llevas ${streak} día${streak === 1 ? "" : "s"} seguido${streak === 1 ? "" : "s"} cumpliendo tu objetivo de ${DAILY_GOAL} tests al día.`
      : `Tu racha de ${streak} día${streak === 1 ? "" : "s"} sigue viva. Haz ${remaining} test${remaining === 1 ? "" : "s"} más hoy para mantenerla.`
    : `Haz ${DAILY_GOAL} tests hoy para empezar tu racha. ¡Llevas ${todayCount}/${DAILY_GOAL}!`;

  return (
    <TooltipProvider delayDuration={150}>
      <UITooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={`relative inline-flex items-center gap-2.5 rounded-full pl-2 pr-3.5 py-1.5 border cursor-help select-none transition-all ${
              active
                ? "bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border-orange-400/50 shadow-[0_0_18px_-4px_rgba(249,115,22,0.5)]"
                : "bg-muted/60 border-border/60"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                active
                  ? "bg-gradient-to-br from-amber-400 to-red-500 shadow-md"
                  : "bg-muted-foreground/20"
              }`}
            >
              <motion.span
                animate={active ? { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <Flame
                  className={`w-4 h-4 ${active ? "text-white" : "text-muted-foreground"}`}
                  strokeWidth={2.4}
                  fill={active ? "currentColor" : "none"}
                />
              </motion.span>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-1">
                <span
                  className={`font-bold font-['Space_Grotesk'] text-lg tabular-nums ${
                    active ? "text-orange-600" : "text-foreground"
                  }`}
                >
                  {streak}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {streak === 1 ? "día" : "días"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: DAILY_GOAL }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i < progress
                          ? active
                            ? "bg-orange-500"
                            : "bg-primary"
                          : "bg-muted-foreground/25"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  hoy {progress}/{DAILY_GOAL}
                </span>
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs leading-relaxed">
          <p className="font-semibold mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" fill="currentColor" /> Racha de estudio
          </p>
          <p>{tip}</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
}


function StudyRunner({ test, onFinish }: { test: StudyTest; onFinish: (r: AttemptResult) => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const { toast } = useToast();

  const q = test.questions[idx];
  const isRevealed = !!revealed[q.id];
  const selected = answers[q.id];
  const isLast = idx === test.questions.length - 1;

  const handleSelect = (i: number) => {
    if (isRevealed) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
    setRevealed((r) => ({ ...r, [q.id]: true }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const duration = Math.round((Date.now() - startedAt) / 1000);
      const { data, error } = await supabase.rpc("submit_test_attempt", {
        _test_id: test.id, _answers: answers, _duration_seconds: duration,
      });
      if (error) throw error;
      onFinish(data as unknown as AttemptResult);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo enviar el test", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = test.questions.filter((qq) => answers[qq.id] === qq.correct_index).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pr-8">

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Modo estudio · {test.category}
          </p>
          <h3 className="text-xl font-bold font-['Space_Grotesk']">{test.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Aciertos</p>
          <p className="text-lg font-bold text-primary">{correctCount}/{answeredCount}</p>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full" style={{ background: MINT }} initial={false} animate={{ width: `${((idx + 1) / test.questions.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
      </div>
      <p className="text-xs text-muted-foreground">Pregunta {idx + 1} de {test.questions.length}</p>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <p className="text-lg font-semibold mb-6">{q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrectOpt = i === q.correct_index;
              const isSelected = selected === i;
              let cls = "border-border hover:border-primary/40 hover:bg-muted/50";
              if (isRevealed) {
                if (isCorrectOpt) cls = "border-primary bg-accent";
                else if (isSelected) cls = "border-destructive bg-destructive/10";
                else cls = "border-border opacity-60";
              } else if (isSelected) {
                cls = "border-primary bg-accent";
              }
              return (
                <button key={i} type="button" disabled={isRevealed} onClick={() => handleSelect(i)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${cls}`}>
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isRevealed && isCorrectOpt ? "bg-primary text-primary-foreground" : isRevealed && isSelected ? "bg-destructive text-destructive-foreground" : isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="pt-1 flex-1">{opt}</span>
                    {isRevealed && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    {isRevealed && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
          {isRevealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-lg text-sm font-medium ${selected === q.correct_index ? "bg-accent text-primary" : "bg-destructive/10 text-destructive"}`}>
              {selected === q.correct_index ? "¡Correcto!" : `Incorrecto. La respuesta correcta es la ${String.fromCharCode(65 + q.correct_index)}.`}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Anterior</Button>
        {!isLast ? (
          <Button onClick={() => setIdx((i) => i + 1)} disabled={!isRevealed}>Siguiente</Button>
        ) : (
          <Button onClick={submit} disabled={submitting || answeredCount < test.questions.length} className="bg-primary hover:bg-primary/90">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Finalizar test
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EXAM MODE RUNNER
// ============================================================
const EXAM_DURATION_SECONDS = 30 * 60;

function ExamRunner({ test, onFinish }: { test: SafeTest; onFinish: (r: AttemptResult) => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(EXAM_DURATION_SECONDS);
  const { toast } = useToast();
  const q = test.questions[idx];
  const answeredCount = Object.keys(answers).length;

  const submit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : EXAM_DURATION_SECONDS;
      const { data, error } = await supabase.rpc("submit_test_attempt", {
        _test_id: test.id, _answers: answers, _duration_seconds: duration,
      });
      if (error) throw error;
      if (auto) toast({ title: "Tiempo agotado", description: "Se ha entregado el examen automáticamente." });
      onFinish(data as unknown as AttemptResult);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo enviar el test", variant: "destructive" });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!started || startedAt === null) return;
    const tick = () => {
      const left = EXAM_DURATION_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(left);
      if (left <= 0) {
        submit(true);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, startedAt]);

  if (!started) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-accent flex items-center justify-center">
          <Timer className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Modo examen · {test.category}
          </p>
          <h3 className="text-2xl font-bold font-['Space_Grotesk']">{test.title}</h3>
        </div>
        <div className="max-w-md mx-auto bg-muted/50 rounded-xl p-5 text-left space-y-2 text-sm">
          <p className="flex items-center gap-2"><Timer className="w-4 h-4 text-primary" /> Tiempo: <span className="font-bold">30 minutos</span> (igual que el examen oficial DGT)</p>
          <p className="flex items-center gap-2"><FileQuestion className="w-4 h-4 text-primary" /> Preguntas: <span className="font-bold">{test.questions.length}</span></p>
          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Aprueba con 3 fallos o menos</p>
          <p className="text-xs text-muted-foreground pt-2">Una vez iniciado el temporizador no se puede pausar. Si se acaba el tiempo, el examen se entregará automáticamente.</p>
        </div>
        <Button
          size="lg"
          onClick={() => { setStarted(true); setStartedAt(Date.now()); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Timer className="w-4 h-4 mr-2" /> Iniciar examen
        </Button>
      </div>
    );
  }

  const mm = Math.max(0, Math.floor(remaining / 60));
  const ss = Math.max(0, remaining % 60);
  const timeLow = remaining <= 60;
  const timeMid = remaining <= 5 * 60 && !timeLow;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pr-8 flex-wrap">

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Timer className="w-3.5 h-3.5" /> Modo examen · {test.category}
          </p>
          <h3 className="text-xl font-bold font-['Space_Grotesk']">{test.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-lg font-mono text-lg font-bold tabular-nums flex items-center gap-2 ${timeLow ? "bg-destructive text-white animate-pulse" : timeMid ? "bg-amber-500 text-white" : "bg-primary text-white"}`}>
            <Timer className="w-4 h-4" />
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Respondidas</p>
            <p className="text-lg font-bold text-primary">{answeredCount}/{test.questions.length}</p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full" style={{ background: MINT }} animate={{ width: `${((idx + 1) / test.questions.length) * 100}%` }} />
      </div>

      <p className="text-xs text-muted-foreground">Pregunta {idx + 1} de {test.questions.length}</p>
      <p className="text-lg font-semibold mb-4">{q.text}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const sel = answers[q.id] === i;
          return (
            <button key={i} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${sel ? "border-primary bg-accent" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}>
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${sel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="pt-1">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Question grid navigator */}
      <div className="grid grid-cols-10 gap-1.5 pt-4 border-t">
        {test.questions.map((qq, i) => {
          const answered = answers[qq.id] !== undefined;
          return (
            <button key={qq.id} onClick={() => setIdx(i)} className={`aspect-square rounded text-[10px] font-bold transition-colors ${i === idx ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1" : answered ? "bg-accent text-primary" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Anterior</Button>
        <div className="flex gap-2">
          {idx < test.questions.length - 1 && (
            <Button variant="outline" onClick={() => setIdx((i) => i + 1)}>Siguiente</Button>
          )}
          <Button onClick={() => submit(false)} disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Enviar test
          </Button>
        </div>
      </div>
      {answeredCount < test.questions.length && (
        <p className="text-xs text-muted-foreground text-center">
          ⚠ Las preguntas sin contestar contarán como fallo.
        </p>
      )}
    </div>
  );
}

// ============================================================
// EXAM RESULT WITH REVIEW
// ============================================================
function ExamResult({ test, answers, result, onClose }: { test: StudyTest; answers: Record<string, number>; result: AttemptResult; onClose: () => void }) {
  const [reviewing, setReviewing] = useState(false);
  if (reviewing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Revisión · {test.title}</h3>
          <Button size="sm" variant="outline" onClick={() => setReviewing(false)}>Volver al resultado</Button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {test.questions.map((q, qi) => {
            const sel = answers[q.id];
            const correct = q.correct_index;
            const ok = sel === correct;
            return (
              <div key={q.id} className={`p-4 rounded-xl border-2 ${ok ? "border-primary/40 bg-accent/40" : "border-destructive/40 bg-destructive/5"}`}>
                <p className="font-semibold mb-2 text-sm">
                  <span className="text-muted-foreground">#{qi + 1}</span> {q.text}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === correct;
                    const isSel = i === sel;
                    return (
                      <div key={i} className={`text-sm p-2 rounded flex items-start gap-2 ${isCorrect ? "bg-accent text-primary font-medium" : isSel ? "bg-destructive/10 text-destructive" : "text-muted-foreground"}`}>
                        <span className="font-bold">{String.fromCharCode(65 + i)}.</span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        {isSel && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
                      </div>
                    );
                  })}
                  {sel === undefined && <p className="text-xs text-destructive italic">No contestada</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${result.passed ? "bg-accent" : "bg-destructive/10"}`}
      >
        {result.passed ? <Trophy className="w-10 h-10 text-primary" /> : <XCircle className="w-10 h-10 text-destructive" />}
      </motion.div>
      <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-1">{result.passed ? "¡Aprobado!" : "Suspenso"}</h2>
      <p className="text-muted-foreground mb-6">Aprueba con 3 fallos o menos (≥ 27 aciertos)</p>
      <p className="text-6xl font-bold font-['Space_Grotesk'] mb-6" style={{ color: getBarometerColor(result.score_percentage) }}>{result.score_percentage}%</p>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
        <div className="p-3 rounded-xl bg-muted/50"><p className="text-2xl font-bold">{result.total_questions}</p><p className="text-xs text-muted-foreground">Preguntas</p></div>
        <div className="p-3 rounded-xl bg-accent"><p className="text-2xl font-bold text-primary">{result.correct_answers}</p><p className="text-xs text-muted-foreground">Aciertos</p></div>
        <div className="p-3 rounded-xl bg-destructive/10"><p className="text-2xl font-bold text-destructive">{result.errors}</p><p className="text-xs text-muted-foreground">Errores</p></div>
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => setReviewing(true)}>Revisar preguntas</Button>
        <Button onClick={onClose} className="bg-primary hover:bg-primary/90">Cerrar</Button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
type Mode = "study" | "exam";
type RunnerState =
  | { kind: "loading"; mode: Mode; testId: string }
  | { kind: "study"; test: StudyTest }
  | { kind: "exam"; test: StudyTest } // we hold full test for review later
  | { kind: "result"; test: StudyTest; answers: Record<string, number>; result: AttemptResult };

export default function Tests() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [runner, setRunner] = useState<RunnerState | null>(null);
  // Exam mode: we need to capture answers to allow review
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});

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
        .from("test_attempts").select("*")
        .eq("user_id", user!.id).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as Attempt[];
    },
    enabled: !!user,
  });

  const { data: answersData } = useQuery({
    queryKey: ["test-answers", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("test_attempt_answers")
        .select("question_id, question_text, is_correct")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []) as AnswerRow[];
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    const list = attempts ?? [];
    const total = list.length;
    const passed = list.filter((a) => a.passed).length;
    const failed = total - passed;
    const errorsTotal = list.reduce((s, a) => s + a.errors, 0);
    const hitsTotal = list.reduce((s, a) => s + a.correct_answers, 0);
    const questionsTotal = list.reduce((s, a) => s + a.total_questions, 0);
    const avgPct = total > 0 ? list.reduce((s, a) => s + Number(a.score_percentage), 0) / total : 0;
    const last = list[0];
    const best = list.reduce<Attempt | null>((b, a) => (!b || Number(a.score_percentage) > Number(b.score_percentage) ? a : b), null);

    const last10 = list.slice(0, 10);
    let barometer = 0;
    if (last10.length > 0) {
      let num = 0, den = 0;
      last10.forEach((a, i) => { const w = last10.length - i; num += Number(a.score_percentage) * w; den += w; });
      barometer = den > 0 ? num / den : 0;
    }

    const lineData = list.slice(0, 20).reverse().map((a, i) => ({ name: `#${i + 1}`, score: Number(a.score_percentage) }));

    // Most failed questions
    const failMap = new Map<string, { text: string; fails: number; total: number }>();
    (answersData ?? []).forEach((a) => {
      const e = failMap.get(a.question_id) ?? { text: a.question_text, fails: 0, total: 0 };
      e.total += 1;
      if (!a.is_correct) e.fails += 1;
      failMap.set(a.question_id, e);
    });
    const mostFailed = Array.from(failMap.values())
      .filter((e) => e.fails > 0)
      .sort((a, b) => b.fails - a.fails || b.total - a.total)
      .slice(0, 5);

    // Per-test best attempt
    const byTest = new Map<string, { best: Attempt; count: number; lastDate: string }>();
    list.forEach((a) => {
      const cur = byTest.get(a.test_id);
      if (!cur) {
        byTest.set(a.test_id, { best: a, count: 1, lastDate: a.created_at });
      } else {
        cur.count += 1;
        if (Number(a.score_percentage) > Number(cur.best.score_percentage)) cur.best = a;
        if (a.created_at > cur.lastDate) cur.lastDate = a.created_at;
      }
    });

    return { total, passed, failed, errorsTotal, hitsTotal, questionsTotal, avgPct, last, best, barometer, lineData, mostFailed, byTest };
  }, [attempts, answersData]);

  const handleStart = async (testId: string, mode: Mode) => {
    setRunner({ kind: "loading", mode, testId });
    setExamAnswers({});
    try {
      const { data, error } = await supabase.rpc("get_test_for_study", { _test_id: testId });
      if (error) throw error;
      const t = data as unknown as StudyTest;
      setRunner(mode === "study" ? { kind: "study", test: t } : { kind: "exam", test: t });
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo cargar el test", variant: "destructive" });
      setRunner(null);
    }
  };

  const handleFinish = (result: AttemptResult) => {
    if (!runner || (runner.kind !== "study" && runner.kind !== "exam")) return;
    setRunner({ kind: "result", test: runner.test, answers: examAnswers, result });
    qc.invalidateQueries({ queryKey: ["test-attempts", user?.id] });
    qc.invalidateQueries({ queryKey: ["test-answers", user?.id] });
  };

  const handleStudyFinish = (result: AttemptResult) => {
    handleFinish(result);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && role !== "student") return <Navigate to="/dashboard" replace />;

  const passedPct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
  const donutData = [
    { name: "Aprobados", value: stats.passed },
    { name: "Suspensos", value: stats.failed },
  ];

  // Group tests in chunks of 10 for accordion
  const groups: { label: string; items: TestListItem[] }[] = [];
  if (tests) {
    const list = [...tests].sort((a, b) => {
      const na = parseInt(a.title.replace(/\D/g, "")) || 0;
      const nb = parseInt(b.title.replace(/\D/g, "")) || 0;
      return na - nb;
    });
    for (let i = 0; i < list.length; i += 10) {
      const from = i + 1;
      const to = Math.min(i + 10, list.length);
      groups.push({ label: `Tests ${from}–${to}`, items: list.slice(i, i + 10) });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm">Volver al panel</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={logoReady2Go} alt="Ready2Go" className="h-9 sm:h-12 w-auto object-contain shrink-0" />
            <span className="text-lg font-bold font-['Space_Grotesk']">Ready2Go</span>
          </Link>
        </div>
      </motion.header>

      <div className="bg-primary pb-24 pt-8 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative">
          {profile?.full_name && (
            <div className="flex justify-end mb-4">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/25 rounded-full px-3.5 py-1.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">{profile.full_name.charAt(0).toUpperCase()}</div>
                <span className="text-xs font-semibold text-primary-foreground/90">{profile.full_name}</span>
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold text-primary-foreground mb-1 font-['Space_Grotesk']">Tests</h1>
          <p className="text-primary-foreground/70">Practica tests oficiales y mide tu nivel</p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-5xl -mt-16 relative z-10 pb-16 space-y-12">
        {/* SECCIÓN 1: Tests disponibles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk']">Empieza ya con el teórico</h2>
              <p className="text-sm text-muted-foreground mt-1">{tests?.length ?? 0} tests oficiales · 30 preguntas cada uno · Apruebas con 3 fallos o menos</p>
            </div>
            <StreakBadge attempts={attempts} />
          </div>

          {testsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-14 w-full" />))}
            </div>
          ) : !tests || tests.length === 0 ? (
            <div className="text-center py-10">
              <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-semibold">Aún no hay tests cargados</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={["g-0"]} className="space-y-3">
              {groups.map((g, gi) => (
                <AccordionItem key={gi} value={`g-${gi}`} className="border border-border/60 rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold font-['Space_Grotesk']">{g.label}</p>
                        <p className="text-xs text-muted-foreground">{g.items.length} tests disponibles</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3 pb-2">
                      {g.items.map((t) => {
                        const info = stats.byTest.get(t.id);
                        const done = !!info;
                        const bestPct = info ? Math.round(Number(info.best.score_percentage)) : 0;
                        const passed = info?.best.passed;
                        return (
                        <Card key={t.id} className={`border-border/50 relative ${done ? "ring-1 ring-primary/30" : ""}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.category}</p>
                              {done && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${passed ? "bg-accent text-primary" : "bg-destructive/10 text-destructive"}`}>
                                  {passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Realizado
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-base mb-2">{t.title}</h3>
                            {done && (
                              <div className="flex items-center justify-between text-xs mb-3 p-2 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Mejor resultado</span>
                                <span className="font-bold" style={{ color: getBarometerColor(bestPct) }}>
                                  {bestPct}% · {info!.best.correct_answers}/{info!.best.total_questions}
                                  {info!.count > 1 && <span className="ml-1 text-muted-foreground font-normal">({info!.count} intentos)</span>}
                                </span>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleStart(t.id, "study")} className="gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> {done ? "Repetir estudio" : "Estudio"}
                              </Button>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5" onClick={() => handleStart(t.id, "exam")}>
                                <Timer className="w-3.5 h-3.5" /> {done ? "Repetir examen" : "Examen"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        {/* SECCIÓN 2: Mis estadísticas */}
        <section>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Mis estadísticas</h2>

          {/* Row 1: barometer + KPIs */}
          <div className="grid lg:grid-cols-5 gap-6 mb-6">
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Barómetro de preparación</CardTitle></CardHeader>
              <CardContent><BarometerGauge value={stats.barometer} /></CardContent>
            </Card>
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              <KpiCard label="Tests realizados" value={stats.total} icon={<FileQuestion className="w-6 h-6 text-primary" />} accent />
              <KpiCard label="Aprobados" value={stats.passed} icon={<CheckCircle2 className="w-6 h-6 text-primary" />} accent />
              <KpiCard label="Suspensos" value={stats.failed} icon={<XCircle className="w-6 h-6 text-foreground" />} />
              <KpiCard label="% medio de acierto" value={`${Math.round(stats.avgPct)}%`} icon={<Target className="w-6 h-6 text-primary" />} accent />
            </div>
          </div>

          {/* Row 2: KPIs adicionales */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <KpiCard label="Último resultado" value={stats.last ? `${Math.round(Number(stats.last.score_percentage))}%` : "—"} icon={<TrendingUp className="w-6 h-6 text-foreground" />} />
            <KpiCard label="Mejor resultado" value={stats.best ? `${Math.round(Number(stats.best.score_percentage))}%` : "—"} icon={<Trophy className="w-6 h-6 text-primary" />} accent />
            <KpiCard label="Preguntas contestadas" value={stats.questionsTotal} icon={<FileQuestion className="w-6 h-6 text-foreground" />} />
            <KpiCard label="Aciertos totales" value={stats.hitsTotal} icon={<CheckCircle2 className="w-6 h-6 text-primary" />} accent />
            <KpiCard label="Fallos totales" value={stats.errorsTotal} icon={<XCircle className="w-6 h-6 text-foreground" />} />
          </div>

          {/* Row 3: line + donut */}
          <div className="grid lg:grid-cols-5 gap-6 mb-6">
            <Card className="border-border/50 lg:col-span-3">
              <CardHeader><CardTitle className="text-base">Evolución (últimos 20 intentos)</CardTitle></CardHeader>
              <CardContent>
                {stats.lineData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">Aún no tienes intentos. Empieza un test para ver tu progreso.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.lineData} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                        <ReferenceLine y={90} stroke="#0a0a0a" strokeDasharray="4 4" strokeOpacity={0.5} />
                        <Line type="monotone" dataKey="score" stroke={MINT} strokeWidth={3} dot={{ fill: MINT, r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Aprobados vs suspensos</CardTitle></CardHeader>
              <CardContent>
                {stats.total === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">Sin datos todavía.</p>
                ) : (
                  <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                          <Cell fill={MINT} /><Cell fill="#0a0a0a" />
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
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
      </main>

      {/* Test runner dialog overlay */}
      <Dialog open={!!runner} onOpenChange={(o) => { if (!o) setRunner(null); }}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogTitle className="sr-only">Test</DialogTitle>
          <DialogDescription className="sr-only">Ventana de realización del test.</DialogDescription>
          {runner?.kind === "loading" && (
            <div className="py-16 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando test…</p>
            </div>
          )}
          {runner?.kind === "study" && (
            <StudyRunner test={runner.test} onFinish={handleStudyFinish} />
          )}
          {runner?.kind === "exam" && (
            <ExamRunnerWithCapture test={runner.test} onAnswersChange={setExamAnswers} onFinish={handleFinish} />
          )}
          {runner?.kind === "result" && (
            <ExamResult test={runner.test} answers={runner.answers} result={runner.result} onClose={() => setRunner(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Exam runner variant that bubbles answers up to the parent so we can render the review screen after.
function ExamRunnerWithCapture({ test, onAnswersChange, onFinish }: { test: SafeTest; onAnswersChange: (a: Record<string, number>) => void; onFinish: (r: AttemptResult) => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(EXAM_DURATION_SECONDS);
  const { toast } = useToast();
  const q = test.questions[idx];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => { onAnswersChange(answers); }, [answers, onAnswersChange]);

  const submit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : EXAM_DURATION_SECONDS;
      const { data, error } = await supabase.rpc("submit_test_attempt", { _test_id: test.id, _answers: answers, _duration_seconds: duration });
      if (error) throw error;
      if (auto) toast({ title: "Tiempo agotado", description: "Se ha entregado el examen automáticamente." });
      onFinish(data as unknown as AttemptResult);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "No se pudo enviar el test", variant: "destructive" });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!started || startedAt === null) return;
    const tick = () => {
      const left = EXAM_DURATION_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(left);
      if (left <= 0) submit(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, startedAt]);

  if (!started) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-accent flex items-center justify-center">
          <Timer className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Modo examen · {test.category}</p>
          <h3 className="text-2xl font-bold font-['Space_Grotesk']">{test.title}</h3>
        </div>
        <div className="max-w-md mx-auto bg-muted/50 rounded-xl p-5 text-left space-y-2 text-sm">
          <p className="flex items-center gap-2"><Timer className="w-4 h-4 text-primary" /> Tiempo: <span className="font-bold">30 minutos</span> (igual que el examen oficial DGT)</p>
          <p className="flex items-center gap-2"><FileQuestion className="w-4 h-4 text-primary" /> Preguntas: <span className="font-bold">{test.questions.length}</span></p>
          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Aprueba con 3 fallos o menos</p>
          <p className="text-xs text-muted-foreground pt-2">Una vez iniciado el temporizador no se puede pausar. Si se acaba el tiempo, el examen se entregará automáticamente.</p>
        </div>
        <Button size="lg" onClick={() => { setStarted(true); setStartedAt(Date.now()); }} className="bg-primary hover:bg-primary/90">
          <Timer className="w-4 h-4 mr-2" /> Iniciar examen
        </Button>
      </div>
    );
  }

  const mm = Math.max(0, Math.floor(remaining / 60));
  const ss = Math.max(0, remaining % 60);
  const timeLow = remaining <= 60;
  const timeMid = remaining <= 5 * 60 && !timeLow;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pr-8 flex-wrap">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Timer className="w-3.5 h-3.5" /> Modo examen · {test.category}</p>
          <h3 className="text-xl font-bold font-['Space_Grotesk']">{test.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-lg font-mono text-lg font-bold tabular-nums flex items-center gap-2 ${timeLow ? "bg-destructive text-white animate-pulse" : timeMid ? "bg-amber-500 text-white" : "bg-primary text-white"}`}>
            <Timer className="w-4 h-4" />
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Respondidas</p>
            <p className="text-lg font-bold text-primary">{answeredCount}/{test.questions.length}</p>
          </div>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full" style={{ background: MINT }} animate={{ width: `${((idx + 1) / test.questions.length) * 100}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">Pregunta {idx + 1} de {test.questions.length}</p>
      <p className="text-lg font-semibold mb-4">{q.text}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const sel = answers[q.id] === i;
          return (
            <button key={i} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${sel ? "border-primary bg-accent" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}>
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${sel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{String.fromCharCode(65 + i)}</span>
                <span className="pt-1">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-10 gap-1.5 pt-4 border-t">
        {test.questions.map((qq, i) => {
          const answered = answers[qq.id] !== undefined;
          return (
            <button key={qq.id} onClick={() => setIdx(i)} className={`aspect-square rounded text-[10px] font-bold transition-colors ${i === idx ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1" : answered ? "bg-accent text-primary" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Anterior</Button>
        <div className="flex gap-2">
          {idx < test.questions.length - 1 && (<Button variant="outline" onClick={() => setIdx((i) => i + 1)}>Siguiente</Button>)}
          <Button onClick={() => submit(false)} disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Enviar test
          </Button>
        </div>
      </div>
      {answeredCount < test.questions.length && (
        <p className="text-xs text-muted-foreground text-center">⚠ Las preguntas sin contestar contarán como fallo.</p>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon, accent }: { label: string; value: number | string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
      <Card className="border-border/50 h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent ? "bg-accent" : "bg-muted"}`}>{icon}</div>
            <div>
              <p className={`text-2xl font-bold font-['Space_Grotesk'] ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
