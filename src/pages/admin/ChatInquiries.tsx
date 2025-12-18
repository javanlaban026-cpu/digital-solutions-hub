import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ChatConversation {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  summary: string | null;
  customer_name: string | null;
  customer_email: string | null;
}

const ChatInquiries = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchConversations = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } else {
      setConversations(data || []);
    }
    setIsLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } else {
      setMessages(data || []);
    }
  };

  const openConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
    setIsDialogOpen(true);
  };

  const deleteConversation = async (id: string) => {
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Conversation deleted successfully",
      });
      fetchConversations();
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const getFirstUserMessage = (conv: ChatConversation) => {
    // We'll show a preview based on conversation time
    return `Chat from ${format(new Date(conv.created_at), "MMM d, yyyy 'at' h:mm a")}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Chat Inquiries</h1>
            <p className="text-muted-foreground">View and manage customer chat conversations</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <MessageCircle className="w-4 h-4 mr-2" />
            {conversations.length} Conversations
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No conversations yet</h3>
              <p className="text-muted-foreground text-center">
                Customer chat conversations will appear here when they start chatting with JL Assistant.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                          {conversation.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(conversation.created_at), "MMM d, yyyy")}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(conversation.created_at), "h:mm a")}
                        </span>
                      </div>
                      <p className="text-foreground font-medium">
                        {conversation.customer_name || "Anonymous Customer"}
                      </p>
                      {conversation.customer_email && (
                        <p className="text-sm text-muted-foreground">{conversation.customer_email}</p>
                      )}
                      {conversation.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {conversation.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConversation(conversation)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteConversation(conversation.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Conversation Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversation Details
              </DialogTitle>
            </DialogHeader>
            {selectedConversation && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedConversation.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </span>
                  <Badge variant={selectedConversation.status === "active" ? "default" : "secondary"}>
                    {selectedConversation.status}
                  </Badge>
                </div>
                <ScrollArea className="h-[400px] border rounded-lg p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted rounded-tl-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(message.created_at), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ChatInquiries;
