import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Payment {
  amount: number;
  status: string;
  created_at: string;
}

interface MonthlySpendingChartProps {
  payments: Payment[] | undefined;
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{payload[0].value.toFixed(2)} €</p>
    </div>
  );
};

export default function MonthlySpendingChart({ payments }: MonthlySpendingChartProps) {
  const chartData = useMemo(() => {
    if (!payments?.length) return [];

    const completed = payments.filter((p) => p.status === "completed");
    const grouped: Record<string, number> = {};

    for (const p of completed) {
      const date = new Date(p.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      grouped[key] = (grouped[key] ?? 0) + p.amount;
    }

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, total]) => {
        const [, month] = key.split("-");
        return {
          month: MONTH_LABELS[parseInt(month, 10) - 1],
          total: Number(total.toFixed(2)),
        };
      });
  }, [payments]);

  const totalSpent = useMemo(() => chartData.reduce((sum, d) => sum + d.total, 0), [chartData]);
  const trend = useMemo(() => {
    if (chartData.length < 2) return 0;
    const last = chartData[chartData.length - 1].total;
    const prev = chartData[chartData.length - 2].total;
    return prev === 0 ? 0 : ((last - prev) / prev) * 100;
  }, [chartData]);
  const maxTotal = useMemo(() => Math.max(...chartData.map((d) => d.total), 1), [chartData]);

  if (!chartData.length) {
    return (
      <Card className="border-border/30 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
        <CardContent className="pt-6">
          <div className="text-center py-10 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Wallet className="w-7 h-7 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">Sin datos de gastos aún</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-gradient-to-br from-card via-card to-muted/10 overflow-hidden relative">
      {/* Decorative orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <CardContent className="pt-6 pb-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gastos mensuales</p>
            <p className="text-2xl font-bold tracking-tight">{totalSpent.toFixed(2)} €</p>
          </div>
          {trend !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                trend > 0
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-500/10 text-green-600 dark:text-green-400"
              }`}
            >
              {trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend).toFixed(0)}%
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}€`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)", radius: 8 }} />
              <Bar dataKey="total" radius={[8, 8, 4, 4]} maxBarSize={44}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.total === maxTotal ? "hsl(var(--primary))" : "url(#barGradient)"}
                    opacity={entry.total === maxTotal ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center">Últimos 6 meses con actividad</p>
      </CardContent>
    </Card>
  );
}
