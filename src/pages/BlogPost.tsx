import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2, FileText, Twitter, Linkedin, Facebook } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
}

const BlogPostPage = () => {
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

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, featured_image, published_at")
        .eq("status", "published")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 lg:py-32">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-[400px] bg-muted rounded-2xl" />
              <div className="space-y-4">
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
            <FileText className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article>
        {/* Magazine-style Header */}
        <header className="pt-8 pb-12 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-8 text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>

            <div className="space-y-6">
              {post.published_at && (
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {Math.ceil(post.content.length / 1000)} min read
                  </span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Share Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <span className="text-sm text-muted-foreground">Share:</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-background border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-full bg-background border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-full bg-background border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Facebook className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image - Full Width */}
        {post.featured_image && (
          <div className="py-12">
            <div className="container mx-auto px-4">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full max-h-[600px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Article Content - Magazine Typography */}
        <div className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Drop Cap First Letter Style */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.content.split("\n").map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  return (
                    <p
                      key={index}
                      className={`text-foreground/90 leading-[1.9] mb-6 text-lg ${
                        index === 0 ? "first-letter:text-6xl first-letter:font-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-cyan-400" : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">JL</span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-foreground">JavaLab Team</p>
                      <p className="text-sm text-muted-foreground">JL Software & Digital Systems</p>
                    </div>
                  </div>
                  
                  <Link to="/contact">
                    <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-10 text-center">
                Continue Reading
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-xl mb-4">
                      {relatedPost.featured_image ? (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full aspect-[3/2] bg-muted flex items-center justify-center">
                          <FileText className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-heading font-semibold text-foreground group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    {relatedPost.published_at && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {format(new Date(relatedPost.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

export default BlogPostPage;