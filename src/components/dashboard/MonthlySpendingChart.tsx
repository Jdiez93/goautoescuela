import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Wallet } from "lucide-react";

interface Payment {
  amount: number;
  status: string;
  created_at: string;
}

interface MonthlySpendingChartProps {
  payments: Payment[] | undefined;
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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
      .slice(-6) // last 6 months
      .map(([key, total]) => {
        const [, month] = key.split("-");
        return {
          month: MONTH_LABELS[parseInt(month, 10) - 1],
          total: Number((total / 100).toFixed(2)),
        };
      });
  }, [payments]);

  if (!chartData.length) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Gastos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-2">
            <Wallet className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Sin datos de gastos aún</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Gastos mensuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `${v}€`} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} €`, "Total"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Últimos 6 meses con actividad</p>
      </CardContent>
    </Card>
  );
}
