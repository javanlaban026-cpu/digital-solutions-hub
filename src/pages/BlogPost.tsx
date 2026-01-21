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
      <article className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
            
            {/* Back Navigation - Minimal */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>

            {/* Article Header */}
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground leading-tight mb-2">
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
            <div className="mb-8">
              <div className={`${post.featured_image ? 'md:flex md:gap-6' : ''}`}>
                {/* Feature Image - Small, Left-aligned */}
                {post.featured_image && (
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full md:w-[280px] aspect-[4/3] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                {/* Introduction Paragraphs */}
                <div className="flex-1">
                  {post.excerpt && (
                    <p className="text-base md:text-lg text-foreground/80 leading-normal mb-3 font-medium italic border-l-4 border-cyan-500/50 pl-4">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* First paragraph with drop cap */}
                  {post.content.split("\n").filter(p => p.trim())[0] && (
                    <p className="text-foreground/90 leading-[1.5] text-base first-letter:text-4xl first-letter:font-heading first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:text-cyan-400">
                      {post.content.split("\n").filter(p => p.trim())[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Soft Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Article Body - Full Width */}
            <div className="prose-custom columns-1 lg:columns-2 gap-8">
              {post.content.split("\n").filter(p => p.trim()).slice(1).map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                
                // Check if paragraph looks like a heading (short and ends without period)
                const isHeading = paragraph.length < 80 && !paragraph.endsWith('.') && paragraph === paragraph.toUpperCase();
                
                if (isHeading) {
                  return (
                    <h2 key={index} className="text-xl font-heading font-bold text-foreground mt-6 mb-2 break-inside-avoid">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Highlight key points (paragraphs starting with specific markers)
                const isHighlight = paragraph.startsWith('Important:') || paragraph.startsWith('Note:') || paragraph.startsWith('Key point:');
                
                if (isHighlight) {
                  return (
                    <div key={index} className="bg-cyan-500/5 border-l-4 border-cyan-500 p-3 rounded-r-lg my-3 break-inside-avoid">
                      <p className="text-foreground/90 leading-[1.5] text-base m-0">
                        {paragraph}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <p
                    key={index}
                    className="text-foreground/90 leading-[1.5] mb-3 text-base break-inside-avoid"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Share & Author Section */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">JL</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">JavaLab Team</p>
                  <p className="text-xs text-muted-foreground">JL Software & Digital Systems</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Share:</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Twitter className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-full border border-border hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                    <Facebook className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="border-cyan-500/30 hover:bg-cyan-500/10 text-xs h-7">
                    Contact
                  </Button>
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-heading font-bold text-foreground mb-6">
                  Continue Reading
                </h3>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="overflow-hidden rounded flex-shrink-0 w-16 h-16">
                        {relatedPost.featured_image ? (
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <FileText className="w-4 h-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-medium text-foreground group-hover:text-cyan-400 transition-colors line-clamp-2 text-sm leading-tight">
                          {relatedPost.title}
                        </h4>
                        {relatedPost.published_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(relatedPost.published_at), "MMM d")}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;