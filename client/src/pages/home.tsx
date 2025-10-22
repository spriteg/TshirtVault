import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Tshirt } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Palette, Ruler, LogOut } from "lucide-react";
import { TshirtDialog } from "@/components/tshirt-dialog";
import { TshirtTable } from "@/components/tshirt-table";
import { TshirtEmptyState } from "@/components/tshirt-empty-state";
import { TshirtTableSkeleton } from "@/components/tshirt-table-skeleton";
import { SizeFilter } from "@/components/size-filter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTshirt, setEditingTshirt] = useState<Tshirt | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const { data: tshirts, isLoading } = useQuery<Tshirt[]>({
    queryKey: ["/api/tshirts"],
  });

  const handleEdit = (tshirt: Tshirt) => {
    setEditingTshirt(tshirt);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTshirt(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTshirt(null);
  };

  const filteredTshirts = tshirts?.filter((tshirt) => {
    const matchesSearch = 
      tshirt.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tshirt.size.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(tshirt.size);
    
    return matchesSearch && matchesSize;
  }) || [];

  const hasActiveFilters = searchQuery || selectedSizes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
                <Palette className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">T-Shirt Inventory</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleAddNew}
                data-testid="button-add-tshirt"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add T-Shirt
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        {(tshirts && tshirts.length > 0) || hasActiveFilters ? (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by color or size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>

              {/* Size Filter */}
              <SizeFilter
                selectedSizes={selectedSizes}
                onSizeToggle={(size: string) => {
                  setSelectedSizes(prev =>
                    prev.includes(size)
                      ? prev.filter(s => s !== size)
                      : [...prev, size]
                  );
                }}
                onClearAll={() => setSelectedSizes([])}
              />
            </div>

            {/* Active Filters Info */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>
                  Showing {filteredTshirts.length} of {tshirts?.length || 0} t-shirts
                </span>
                {(searchQuery || selectedSizes.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSizes([]);
                    }}
                    className="h-7 px-2"
                    data-testid="button-clear-filters"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Table or Empty State */}
        {isLoading ? (
          <TshirtTableSkeleton />
        ) : !tshirts || tshirts.length === 0 ? (
          <TshirtEmptyState onAddNew={handleAddNew} />
        ) : filteredTshirts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Ruler className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No matching t-shirts</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              No t-shirts match your current filters. Try adjusting your search or filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSizes([]);
              }}
              data-testid="button-clear-search"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <TshirtTable 
            tshirts={filteredTshirts}
            onEdit={handleEdit}
          />
        )}
      </main>

      {/* Add/Edit Dialog */}
      <TshirtDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        tshirt={editingTshirt}
      />
    </div>
  );
}
