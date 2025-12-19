import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { format } from "date-fns";
import { ArrowRight, Calendar, FileText } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Blog"
            title="Latest Insights"
            description="Stay updated with our latest articles, tutorials, and industry insights."
          />

          <div className="mt-16">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl animate-pulse">
                    <div className="h-48 bg-muted rounded-t-2xl" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Check back soon for new articles!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-2"
                  >
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.published_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </div>
                      )}
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 text-primary font-medium mt-4">
                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
