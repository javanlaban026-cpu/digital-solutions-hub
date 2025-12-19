import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { format } from "date-fns";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

const Offers = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  });

  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Offer[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        discount_percentage: data.discount_percentage || null,
        valid_from: data.valid_from || null,
        valid_until: data.valid_until || null,
      };
      if (editingOffer) {
        const { error } = await supabase
          .from("offers")
          .update(payload)
          .eq("id", editingOffer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offers").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success(editingOffer ? "Offer updated" : "Offer added");
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer deleted");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", discount_percentage: 0, valid_from: "", valid_until: "", is_active: true });
    setEditingOffer(null);
    setIsDialogOpen(false);
  };

  const openEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      discount_percentage: offer.discount_percentage || 0,
      valid_from: offer.valid_from ? offer.valid_from.split("T")[0] : "",
      valid_until: offer.valid_until ? offer.valid_until.split("T")[0] : "",
      is_active: offer.is_active,
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Offers Management</h1>
            <p className="text-muted-foreground">Manage special offers displayed on your website</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Offer</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingOffer ? "Edit Offer" : "Add New Offer"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <Label>Discount Percentage</Label>
                  <Input type="number" min="0" max="100" value={formData.discount_percentage} onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valid From</Label>
                    <Input type="date" value={formData.valid_from} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })} />
                  </div>
                  <div>
                    <Label>Valid Until</Label>
                    <Input type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                  <Label>Active</Label>
                </div>
                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editingOffer ? "Update" : "Add Offer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : offers?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No offers yet</TableCell></TableRow>
              ) : (
                offers?.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="font-medium">{offer.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {offer.discount_percentage ? `${offer.discount_percentage}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {offer.valid_from && offer.valid_until
                        ? `${format(new Date(offer.valid_from), "MMM d")} - ${format(new Date(offer.valid_until), "MMM d, yyyy")}`
                        : "No date set"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${offer.is_active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                        {offer.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(offer)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(offer.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Offers;
