import { type Tshirt } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteTshirtDialog } from "@/components/delete-tshirt-dialog";
import { useState, useMemo } from "react";

interface TshirtTableProps {
  tshirts: Tshirt[];
  onEdit: (tshirt: Tshirt) => void;
}

interface GroupedTshirts {
  [color: string]: Tshirt[];
}

export function TshirtTable({ tshirts, onEdit }: TshirtTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTshirt, setDeletingTshirt] = useState<Tshirt | null>(null);

  const handleDeleteClick = (tshirt: Tshirt) => {
    setDeletingTshirt(tshirt);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingTshirt(null);
  };

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];

  const groupedByColor = useMemo(() => {
    const grouped: GroupedTshirts = {};
    tshirts.forEach((tshirt) => {
      const color = tshirt.color;
      if (!grouped[color]) {
        grouped[color] = [];
      }
      grouped[color].push(tshirt);
    });
    
    // Sort items within each color by size order
    Object.keys(grouped).forEach((color) => {
      grouped[color].sort((a, b) => {
        const aIndex = sizeOrder.indexOf(a.size.toUpperCase());
        const bIndex = sizeOrder.indexOf(b.size.toUpperCase());
        
        // If size not in predefined order, put it at the end
        if (aIndex === -1 && bIndex === -1) return a.size.localeCompare(b.size);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        
        return aIndex - bIndex;
      });
    });
    
    return grouped;
  }, [tshirts]);

  const colors = Object.keys(groupedByColor).sort();

  return (
    <>
      <div className="space-y-4">
        {colors.map((color) => (
          <Card key={color} className="p-6" data-testid={`color-group-${color}`}>
            <div className="flex flex-col gap-4">
              {/* Color and Items on Same Line for Desktop */}
              <div className="hidden md:flex md:items-start md:gap-6">
                <div className="min-w-[120px]">
                  <h3 className="text-lg font-semibold" data-testid={`text-color-header-${color}`}>
                    {color}
                  </h3>
                </div>
                <div className="flex-1 flex flex-wrap gap-4">
                  {groupedByColor[color].map((tshirt, index) => (
                    <div
                      key={tshirt.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-md bg-muted/30 hover-elevate"
                      data-testid={`item-tshirt-${color}-${index}`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Size
                          </span>
                          <span className="font-medium" data-testid={`text-size-${color}-${index}`}>
                            {tshirt.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Qty
                          </span>
                          <span className="font-medium" data-testid={`text-quantity-${color}-${index}`}>
                            {tshirt.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(tshirt)}
                          data-testid={`button-edit-${color}-${index}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeleteClick(tshirt)}
                          data-testid={`button-delete-${color}-${index}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile View - Color as Header with Items Below */}
              <div className="md:hidden">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" data-testid={`text-color-header-mobile-${color}`}>
                  {color}
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-count-mobile-${color}`}>
                    {groupedByColor[color].reduce((sum, t) => sum + t.quantity, 0)}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {groupedByColor[color].map((tshirt, index) => (
                    <div
                      key={tshirt.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/30"
                      data-testid={`item-tshirt-mobile-${color}-${index}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Size
                          </span>
                          <span className="font-medium" data-testid={`text-size-mobile-${color}-${index}`}>
                            {tshirt.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Qty
                          </span>
                          <span className="text-sm font-medium" data-testid={`text-quantity-mobile-${color}-${index}`}>
                            {tshirt.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(tshirt)}
                          data-testid={`button-edit-mobile-${color}-${index}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(tshirt)}
                          data-testid={`button-delete-mobile-${color}-${index}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingTshirt && (
        <DeleteTshirtDialog
          open={deleteDialogOpen}
          onOpenChange={handleCloseDeleteDialog}
          tshirt={deletingTshirt}
        />
      )}
    </>
  );
}
