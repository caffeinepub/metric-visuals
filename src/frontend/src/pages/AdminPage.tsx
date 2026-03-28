import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Enquiry } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteEnquiry,
  useGetAllEnquiries,
  useIsCallerAdmin,
  useUpdateEnquiryStatus,
} from "../hooks/useQueries";

const LOGO_PATH =
  "/assets/uploads/60f66648-87bd-4522-ba3b-20bd6cf14069-019d347b-c35e-75cb-8910-fcca614bd0e3-1.jpeg";

const STATUSES = ["New", "Reviewed", "Contacted", "Booked", "Declined"];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Reviewed: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Contacted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Booked: "bg-green-500/20 text-green-300 border-green-500/30",
  Declined: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: enquiries = [], isLoading: enquiriesLoading } =
    useGetAllEnquiries();
  const { mutateAsync: updateStatus, isPending: updatingStatus } =
    useUpdateEnquiryStatus();
  const { mutateAsync: deleteEnquiry, isPending: deleting } =
    useDeleteEnquiry();

  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleLogin = async () => {
    try {
      await login();
    } catch (e: any) {
      if (e?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success("Logged out successfully");
  };

  const handleStatusUpdate = async (id: bigint, status: string) => {
    try {
      await updateStatus({ id, status });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEnquiry(deleteTarget);
      toast.success("Enquiry deleted");
      setDeleteTarget(null);
      if (selected?.id === deleteTarget) setSelected(null);
    } catch {
      toast.error("Failed to delete enquiry");
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.serviceType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-sheen rounded-2xl p-10 max-w-sm w-full text-center"
          data-ocid="admin.modal"
        >
          <img
            src={LOGO_PATH}
            alt="Metric Visuals"
            className="h-14 w-auto object-contain mx-auto mb-8"
          />
          <h1 className="font-heading font-black text-2xl uppercase tracking-widest text-foreground mb-2">
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to manage your enquiries
          </p>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-3 rounded-full gradient-bg text-white font-black text-sm tracking-widest uppercase hover:shadow-glow transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} /> SIGN IN
              </>
            )}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted-foreground text-xs mt-6 hover:text-foreground transition-colors"
            data-ocid="admin.link"
          >
            <ArrowLeft size={12} /> Back to website
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading admin check
  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="text-center card-sheen rounded-2xl p-10 max-w-sm w-full"
          data-ocid="admin.error_state"
        >
          <p className="text-destructive text-lg font-semibold mb-2">
            Access Denied
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have admin privileges.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
            data-ocid="admin.secondary_button"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="admin.link"
              >
                <ArrowLeft size={20} />
              </Link>
              <img
                src={LOGO_PATH}
                alt="Metric Visuals"
                className="h-9 w-auto object-contain"
              />
              <span className="text-muted-foreground text-sm font-medium hidden sm:block">
                Admin Dashboard
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
              data-ocid="admin.secondary_button"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {["All", ...STATUSES].map((status) => {
            const count =
              status === "All"
                ? enquiries.length
                : enquiries.filter((e) => e.status === status).length;
            return (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`card-sheen rounded-xl p-4 text-center transition-all duration-200 ${
                  statusFilter === status
                    ? "border-primary/50 shadow-glow"
                    : "hover:border-white/15"
                }`}
                data-ocid="admin.tab"
              >
                <p
                  className={`font-heading font-black text-2xl ${statusFilter === status ? "gradient-text" : "text-foreground"}`}
                >
                  {count}
                </p>
                <p className="text-muted-foreground text-xs tracking-wide mt-1">
                  {status}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or service..."
            className="bg-input border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl flex-1"
            data-ocid="admin.search_input"
          />
        </div>

        {/* Table */}
        <div
          className="card-sheen rounded-2xl overflow-hidden"
          data-ocid="admin.table"
        >
          {enquiriesLoading ? (
            <div
              className="flex items-center justify-center py-16"
              data-ocid="admin.loading_state"
            >
              <Loader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16" data-ocid="admin.empty_state">
              <p className="text-muted-foreground">No enquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase">
                      Email
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase hidden md:table-cell">
                      Service
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase hidden lg:table-cell">
                      Event Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold tracking-wider text-xs uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((enquiry, i) => (
                    <TableRow
                      key={enquiry.id.toString()}
                      className="border-border hover:bg-white/3 transition-colors"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-medium text-foreground">
                        {enquiry.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {enquiry.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                        {enquiry.serviceType}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                        {enquiry.eventDate || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={enquiry.status}
                          onValueChange={(v) =>
                            handleStatusUpdate(enquiry.id, v)
                          }
                          disabled={updatingStatus}
                        >
                          <SelectTrigger
                            className={`w-32 h-7 text-xs border rounded-full px-3 ${
                              STATUS_COLORS[enquiry.status] ||
                              "bg-muted text-muted-foreground"
                            }`}
                            data-ocid={`admin.select.${i + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {STATUSES.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-foreground text-xs"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(enquiry)}
                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                            title="View details"
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(enquiry.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            title="Delete"
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Enquiry detail modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent
          className="bg-popover border-border text-foreground max-w-lg"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-heading font-black uppercase tracking-widest gradient-text">
              Enquiry Details
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg text-foreground">
                  {selected.name}
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[selected.status] || ""}`}
                >
                  {selected.status}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Mail, label: "Email", val: selected.email },
                  { icon: Phone, label: "Phone", val: selected.phone },
                  {
                    icon: MapPin,
                    label: "Location",
                    val: selected.location || "—",
                  },
                  {
                    icon: Calendar,
                    label: "Event Date",
                    val: selected.eventDate || "—",
                  },
                  {
                    icon: Clock,
                    label: "Duration",
                    val: selected.duration || "—",
                  },
                ].map(({ icon: Icon, label, val }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 bg-muted/30 rounded-xl p-3"
                  >
                    <Icon
                      size={14}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-muted-foreground text-xs">{label}</p>
                      <p className="text-foreground text-sm">{val}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="text-foreground text-sm font-medium">
                    {selected.serviceType}
                  </p>
                </div>
                {selected.budgetRange && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Budget Range
                    </p>
                    <p className="text-foreground text-sm">
                      {selected.budgetRange}
                    </p>
                  </div>
                )}
                {selected.message && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={12} className="text-primary" />
                      <p className="text-xs text-muted-foreground">Message</p>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">
                      {selected.message}
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        handleStatusUpdate(selected.id, s);
                        setSelected({ ...selected, status: s });
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selected.status === s
                          ? STATUS_COLORS[s]
                          : "border-white/10 text-muted-foreground hover:border-white/30"
                      }`}
                      data-ocid="admin.button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-popover border-border text-foreground"
          data-ocid="admin.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Enquiry?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The enquiry will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-muted border-border text-foreground hover:bg-muted/80"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="gradient-bg text-white hover:opacity-90"
              data-ocid="admin.confirm_button"
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
