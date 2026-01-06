import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorStats {
  totalViews: number;
  todayViews: number;
  uniqueVisitors: number;
  todayUniqueVisitors: number;
  liveVisitors: number;
}

export const useRealtimeVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    todayUniqueVisitors: 0,
    liveVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

      // Fetch all page views
      const { data: allViews, error: allError } = await supabase
        .from('page_views')
        .select('id, session_id, created_at');

      if (allError) throw allError;

      const views = allViews || [];
      
      // Calculate stats
      const totalViews = views.length;
      const uniqueVisitors = new Set(views.map(v => v.session_id)).size;
      
      // Today's views
      const todayViews = views.filter(v => v.created_at >= startOfDay).length;
      const todayUniqueVisitors = new Set(
        views.filter(v => v.created_at >= startOfDay).map(v => v.session_id)
      ).size;
      
      // Live visitors (active in last 5 minutes)
      const liveVisitors = new Set(
        views.filter(v => v.created_at >= fiveMinutesAgo).map(v => v.session_id)
      ).size;

      setStats({
        totalViews,
        todayViews,
        uniqueVisitors,
        todayUniqueVisitors,
        liveVisitors,
      });
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('page-views-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views',
        },
        () => {
          // Refetch stats when new page view is recorded
          fetchStats();
        }
      )
      .subscribe();

    // Also refresh every 30 seconds for live visitor count accuracy
    const interval = setInterval(fetchStats, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { stats, loading, refetch: fetchStats };
};
