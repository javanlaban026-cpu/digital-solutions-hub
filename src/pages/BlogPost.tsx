import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Calendar, FileText } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 lg:py-32">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="py-24 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              {post.title}
            </h1>
            {post.published_at && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </div>
            )}
          </header>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-2xl mb-10 shadow-lg"
            />
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
