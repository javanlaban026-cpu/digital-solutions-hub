import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Pencil, Trash2, Upload, UserCircle, Linkedin, Twitter, Mail, Globe } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  website_url: string | null;
  years_experience: number | null;
  projects_completed: number | null;
  certifications: number | null;
  awards: number | null;
  tagline: string | null;
}

const Team = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image_url: "",
    display_order: 0,
    is_active: true,
    linkedin_url: "",
    twitter_url: "",
    email: "",
    website_url: "",
    years_experience: 0,
    projects_completed: 0,
    certifications: 0,
    awards: 0,
    tagline: "",
  });

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("team")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("team").getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        linkedin_url: data.linkedin_url || null,
        twitter_url: data.twitter_url || null,
        email: data.email || null,
        website_url: data.website_url || null,
        tagline: data.tagline || null,
      };
      
      if (editingMember) {
        const { error } = await supabase
          .from("team_members")
          .update(payload)
          .eq("id", editingMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success(editingMember ? "Member updated" : "Member added");
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Member deleted");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      description: "",
      image_url: "",
      display_order: 0,
      is_active: true,
      linkedin_url: "",
      twitter_url: "",
      email: "",
      website_url: "",
      years_experience: 0,
      projects_completed: 0,
      certifications: 0,
      awards: 0,
      tagline: "",
    });
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      image_url: member.image_url || "",
      display_order: member.display_order,
      is_active: member.is_active,
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
      email: member.email || "",
      website_url: member.website_url || "",
      years_experience: member.years_experience || 0,
      projects_completed: member.projects_completed || 0,
      certifications: member.certifications || 0,
      awards: member.awards || 0,
      tagline: member.tagline || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members displayed on the website</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Edit Member" : "Add Team Member"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="social">Social Links</TabsTrigger>
                    <TabsTrigger value="stats">Stats & Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="flex justify-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                        />
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                            {uploading ? <span className="text-xs">Uploading...</span> : <Upload className="w-6 h-6 text-muted-foreground" />}
                          </div>
                        )}
                      </label>
                    </div>
                    <div>
                      <Label>Name *</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Role *</Label>
                      <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Tagline (Short quote or motto)</Label>
                      <Input 
                        value={formData.tagline} 
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} 
                        placeholder="e.g., 'Building the future, one line at a time'"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Display Order</Label>
                        <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="space-y-4 mt-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" /> LinkedIn URL
                      </Label>
                      <Input 
                        value={formData.linkedin_url} 
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} 
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Twitter className="w-4 h-4" /> Twitter URL
                      </Label>
                      <Input 
                        value={formData.twitter_url} 
                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })} 
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Label>
                      <Input 
                        type="email"
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Website URL
                      </Label>
                      <Input 
                        value={formData.website_url} 
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} 
                        placeholder="https://example.com"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Years of Experience</Label>
                        <Input 
                          type="number" 
                          value={formData.years_experience} 
                          onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <Label>Projects Completed</Label>
                        <Input 
                          type="number" 
                          value={formData.projects_completed} 
                          onChange={(e) => setFormData({ ...formData, projects_completed: parseInt(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <Label>Certifications</Label>
                        <Input 
                          type="number" 
                          value={formData.certifications} 
                          onChange={(e) => setFormData({ ...formData, certifications: parseInt(e.target.value) || 0 })} 
                        />
                      </div>
                      <div>
                        <Label>Awards</Label>
                        <Input 
                          type="number" 
                          value={formData.awards} 
                          onChange={(e) => setFormData({ ...formData, awards: parseInt(e.target.value) || 0 })} 
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These stats will be displayed on the expert's profile and animated on the homepage.
                    </p>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editingMember ? "Update Member" : "Add Member"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Socials</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : teamMembers?.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">No team members yet</TableCell></TableRow>
              ) : (
                teamMembers?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <UserCircle className="w-10 h-10 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {member.linkedin_url && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                        {member.twitter_url && <Twitter className="w-4 h-4 text-muted-foreground" />}
                        {member.email && <Mail className="w-4 h-4 text-muted-foreground" />}
                        {member.website_url && <Globe className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>{member.display_order}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${member.is_active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(member)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(member.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default Team;
