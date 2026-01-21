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
      <article className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-[780px] mx-auto">
            
            {/* Back Navigation - Minimal */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {Math.ceil(post.content.length / 1000)} min read
                </span>
              </div>
            </header>

            {/* Magazine Intro Section - Image Left, Text Right */}
            <div className="mb-12">
              <div className={`${post.featured_image ? 'md:flex md:gap-8' : ''}`}>
                {/* Feature Image - Small, Left-aligned */}
                {post.featured_image && (
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full md:w-[300px] aspect-[4/3] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                {/* Introduction Paragraphs */}
                <div className="flex-1">
                  {post.excerpt && (
                    <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 font-medium italic border-l-4 border-cyan-500/50 pl-4">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* First paragraph with drop cap */}
                  {post.content.split("\n").filter(p => p.trim())[0] && (
                    <p className="text-foreground/90 leading-[1.8] text-[17px] first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-cyan-400">
                      {post.content.split("\n").filter(p => p.trim())[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Soft Divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Article Body - Clean Single Column */}
            <div className="prose-custom">
              {post.content.split("\n").filter(p => p.trim()).slice(1).map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                
                // Check if paragraph looks like a heading (short and ends without period)
                const isHeading = paragraph.length < 80 && !paragraph.endsWith('.') && paragraph === paragraph.toUpperCase();
                
                if (isHeading) {
                  return (
                    <h2 key={index} className="text-2xl font-heading font-bold text-foreground mt-10 mb-4">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Highlight key points (paragraphs starting with specific markers)
                const isHighlight = paragraph.startsWith('Important:') || paragraph.startsWith('Note:') || paragraph.startsWith('Key point:');
                
                if (isHighlight) {
                  return (
                    <div key={index} className="bg-cyan-500/5 border-l-4 border-cyan-500 p-4 rounded-r-lg my-6">
                      <p className="text-foreground/90 leading-[1.8] text-[17px] m-0">
                        {paragraph}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <p
                    key={index}
                    className="text-foreground/90 leading-[1.8] mb-6 text-[17px]"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Share this article:</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                      <Twitter className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                      <Facebook className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="border-cyan-500/30 hover:bg-cyan-500/10">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">JL</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">JavaLab Team</p>
                  <p className="text-sm text-muted-foreground">JL Software & Digital Systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-20 py-16 bg-muted/20 border-t border-border">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-10 text-center">
                Continue Reading
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-lg mb-4">
                      {relatedPost.featured_image ? (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-heading font-semibold text-foreground group-hover:text-cyan-400 transition-colors line-clamp-2 text-sm">
                      {relatedPost.title}
                    </h4>
                    {relatedPost.published_at && (
                      <p className="text-xs text-muted-foreground mt-1">
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