import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  image_url: string | null;
  project_url: string | null;
  technologies: string[];
  status: string;
  created_at: string;
}

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    image_url: "",
    project_url: "",
    technologies: "",
    status: "draft",
  });

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: formData.image_url || null,
      project_url: formData.project_url || null,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      status: formData.status,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("portfolio_items")
        .update(payload)
        .eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Portfolio item updated" });
      }
    } else {
      const { error } = await supabase.from("portfolio_items").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Portfolio item created" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Item deleted" });
      fetchItems();
    }
  };

  const toggleStatus = async (item: PortfolioItem) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("portfolio_items")
      .update({ status: newStatus })
      .eq("id", item.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", tags: "", image_url: "", project_url: "", technologies: "", status: "draft" });
    setEditingItem(null);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      tags: item.tags.join(", "),
      image_url: item.image_url || "",
      project_url: item.project_url || "",
      technologies: item.technologies.join(", "),
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Portfolio Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Project" : "Add New Project"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <Input placeholder="Category (e.g., Website, Software)" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                <Input placeholder="Technologies (comma-separated)" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} />
                <Input placeholder="Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                <Input placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                <Input placeholder="Project URL" value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} />
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">{editingItem ? "Update" : "Create"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No portfolio items yet.</p>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category} • {item.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(item)}>
                    {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
