import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp } from "lucide-react";

interface TopPage {
  page_path: string;
  views: number;
  uniqueVisitors: number;
}

interface TopPagesTableProps {
  pages: TopPage[];
  loading?: boolean;
}

const formatPagePath = (path: string) => {
  if (path === "/") return "Home";
  return path.replace("/", "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const TopPagesTable = ({ pages, loading }: TopPagesTableProps) => {
  if (loading) {
    return (
      <Card className="blur-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 animate-pulse">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="blur-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Top Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No page views recorded yet</p>
        ) : (
          <div className="space-y-2">
            {pages.map((page, index) => (
              <div
                key={page.page_path}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="text-foreground font-medium">{formatPagePath(page.page_path)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{page.views} views</span>
                  </div>
                  <span className="text-primary font-medium">{page.uniqueVisitors} visitors</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
