import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';

interface TopPage {
  page_path: string;
  views: number;
  uniqueVisitors: number;
}

interface DailyView {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface PageAnalytics {
  topPages: TopPage[];
  dailyViews: DailyView[];
  weeklyViews: DailyView[];
}

export const usePageAnalytics = () => {
  const [analytics, setAnalytics] = useState<PageAnalytics>({
    topPages: [],
    dailyViews: [],
    weeklyViews: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const sevenDaysAgo = subDays(now, 7).toISOString();
      const thirtyDaysAgo = subDays(now, 30).toISOString();

      // Fetch page views for analytics
      const { data: views, error } = await supabase
        .from('page_views')
        .select('page_path, session_id, created_at')
        .gte('created_at', thirtyDaysAgo);

      if (error) throw error;

      const allViews = views || [];

      // Calculate top pages
      const pageMap = new Map<string, { views: number; sessions: Set<string> }>();
      allViews.forEach((view) => {
        const existing = pageMap.get(view.page_path) || { views: 0, sessions: new Set() };
        existing.views++;
        existing.sessions.add(view.session_id);
        pageMap.set(view.page_path, existing);
      });

      const topPages: TopPage[] = Array.from(pageMap.entries())
        .map(([page_path, data]) => ({
          page_path,
          views: data.views,
          uniqueVisitors: data.sessions.size,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Calculate daily views for last 7 days
      const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(now, i), 'yyyy-MM-dd');
        dailyMap.set(date, { views: 0, sessions: new Set() });
      }

      allViews
        .filter((v) => v.created_at >= sevenDaysAgo)
        .forEach((view) => {
          const date = format(new Date(view.created_at), 'yyyy-MM-dd');
          const existing = dailyMap.get(date);
          if (existing) {
            existing.views++;
            existing.sessions.add(view.session_id);
          }
        });

      const dailyViews: DailyView[] = Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.sessions.size,
      }));

      // Calculate weekly views for last 4 weeks
      const weeklyMap = new Map<string, { views: number; sessions: Set<string> }>();
      for (let i = 3; i >= 0; i--) {
        const weekStart = format(subDays(now, i * 7 + 6), 'MMM d');
        const weekEnd = format(subDays(now, i * 7), 'MMM d');
        const label = `${weekStart} - ${weekEnd}`;
        weeklyMap.set(label, { views: 0, sessions: new Set() });
      }

      allViews.forEach((view) => {
        const viewDate = new Date(view.created_at);
        const daysAgo = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(daysAgo / 7);
        if (weekIndex >= 0 && weekIndex < 4) {
          const weekStart = format(subDays(now, weekIndex * 7 + 6), 'MMM d');
          const weekEnd = format(subDays(now, weekIndex * 7), 'MMM d');
          const label = `${weekStart} - ${weekEnd}`;
          const existing = weeklyMap.get(label);
          if (existing) {
            existing.views++;
            existing.sessions.add(view.session_id);
          }
        }
      });

      const weeklyViews: DailyView[] = Array.from(weeklyMap.entries())
        .reverse()
        .map(([date, data]) => ({
          date,
          views: data.views,
          uniqueVisitors: data.sessions.size,
        }));

      setAnalytics({ topPages, dailyViews, weeklyViews });
    } catch (error) {
      console.error('Error fetching page analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('page-analytics-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views',
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { analytics, loading, refetch: fetchAnalytics };
};
