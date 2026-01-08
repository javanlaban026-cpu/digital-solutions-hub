import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

interface DailyView {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface VisitorChartProps {
  data: DailyView[];
  title: string;
  loading?: boolean;
}

const chartConfig = {
  views: {
    label: "Page Views",
    color: "hsl(var(--primary))",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const VisitorChart = ({ data, title, loading }: VisitorChartProps) => {
  if (loading) {
    return (
      <Card className="blur-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    if (dateStr.includes("-") && dateStr.length === 10) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return dateStr;
  };

  return (
    <Card className="blur-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 || data.every((d) => d.views === 0) ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Page Views" />
              <Bar dataKey="uniqueVisitors" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Unique Visitors" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
