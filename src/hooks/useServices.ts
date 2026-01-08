import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  full_description: string | null;
  process_steps: ProcessStep[];
  features: string[];
  starting_price: number | null;
  delivery_time: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      return (data || []).map((service) => ({
        ...service,
        process_steps: (service.process_steps as unknown as ProcessStep[]) || [],
        features: (service.features as unknown as string[]) || [],
      })) as Service[];
    },
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        process_steps: (data.process_steps as unknown as ProcessStep[]) || [],
        features: (data.features as unknown as string[]) || [],
      } as Service;
    },
    enabled: !!slug,
  });
};

export const useServiceCategories = () => {
  const { data: services } = useServices();
  
  const categories = services?.reduce((acc, service) => {
    if (!acc.includes(service.category)) {
      acc.push(service.category);
    }
    return acc;
  }, [] as string[]) || [];

  return categories;
};
