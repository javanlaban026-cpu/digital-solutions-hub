import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface DemoRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  product: string;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const DemoRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [notes, setNotes] = useState("");

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("demo_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchRequests();
    }
  };

  const saveNotes = async () => {
    if (!selectedRequest) return;
    const { error } = await supabase.from("demo_requests").update({ notes }).eq("id", selectedRequest.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Notes saved" });
      setSelectedRequest(null);
      fetchRequests();
    }
  };

  const openDetails = (request: DemoRequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || "");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Demo Requests</h1>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground">No demo requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="glass-card rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="cursor-pointer" onClick={() => openDetails(req)}>
                    <h3 className="font-semibold text-foreground">{req.name}</h3>
                    <p className="text-sm text-muted-foreground">{req.email} • {req.product}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(req.created_at), "PPp")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[req.status]}>{req.status}</Badge>
                    <Select value={req.status} onValueChange={(v) => updateStatus(req.id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedRequest.name}</div>
                  <div><strong>Company:</strong> {selectedRequest.company || "N/A"}</div>
                  <div><strong>Email:</strong> {selectedRequest.email}</div>
                  <div><strong>Phone:</strong> {selectedRequest.phone || "N/A"}</div>
                  <div className="col-span-2"><strong>Product:</strong> {selectedRequest.product}</div>
                  <div className="col-span-2"><strong>Message:</strong> {selectedRequest.message || "N/A"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Internal Notes</label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." />
                </div>
                <Button onClick={saveNotes}>Save Notes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DemoRequests;
