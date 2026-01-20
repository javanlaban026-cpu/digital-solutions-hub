import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { format } from "date-fns";
import { ArrowRight, Calendar, FileText, Clock, User } from "lucide-react";

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

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 4);
  const otherPosts = posts?.slice(4);

  return (
    <Layout>
      {/* Magazine Header */}
      <section className="pt-12 pb-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">The</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground tracking-tight mt-2">
              JL <span className="italic font-normal">Journal</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Insights • Tutorials • Industry News
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-12">
              {/* Featured Skeleton */}
              <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-2xl" />
                <div className="space-y-4 py-8">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-10 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-24">
              <FileText className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're crafting insightful articles for you. Check back soon for the latest in technology and innovation.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {/* Featured Article - Magazine Hero Style */}
              {featuredPost && (
                <article className="group">
                  <Link to={`/blog/${featuredPost.slug}`} className="block">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                      <div className="relative overflow-hidden rounded-2xl">
                        {featuredPost.featured_image ? (
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <FileText className="w-20 h-20 text-cyan-400/40" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {featuredPost.published_at && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(featuredPost.published_at), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              5 min read
                            </span>
                          </div>
                        )}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight group-hover:text-cyan-400 transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold pt-4">
                          Read Full Article
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              )}

              {/* Recent Articles - Magazine Grid */}
              {recentPosts && recentPosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <h3 className="text-xl font-heading font-bold text-foreground uppercase tracking-wider">
                      Recent Stories
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group block"
                      >
                        <article className="h-full">
                          <div className="relative overflow-hidden rounded-xl mb-5">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full aspect-[3/2] object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full aspect-[3/2] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-cyan-400/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          {post.published_at && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="uppercase tracking-wider">
                                {format(new Date(post.published_at), "MMM d, yyyy")}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              <span>4 min read</span>
                            </div>
                          )}
                          
                          <h4 className="text-xl font-heading font-semibold text-foreground mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* More Articles - Compact List */}
              {otherPosts && otherPosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <h3 className="text-xl font-heading font-bold text-foreground uppercase tracking-wider">
                      More Articles
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {otherPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex gap-5 p-4 rounded-xl border border-border/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
                      >
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <FileText className="w-8 h-8 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-semibold text-foreground mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          {post.published_at && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(post.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Stay in the Loop
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get the latest insights on software development, digital systems, and tech industry trends delivered to your inbox.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;