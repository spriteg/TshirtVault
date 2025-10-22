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

  const groupedByColor = useMemo(() => {
    const grouped: GroupedTshirts = {};
    tshirts.forEach((tshirt) => {
      const color = tshirt.color;
      if (!grouped[color]) {
        grouped[color] = [];
      }
      grouped[color].push(tshirt);
    });
    return grouped;
  }, [tshirts]);

  const colors = Object.keys(groupedByColor).sort();

  return (
    <>
      {/* Desktop View - Grouped by Color */}
      <div className="hidden md:block space-y-6">
        {colors.map((color) => (
          <Card key={color} className="overflow-hidden" data-testid={`color-group-${color}`}>
            <div className="bg-muted/50 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold" data-testid={`text-color-header-${color}`}>
                  {color}
                </h3>
                <Badge variant="secondary" data-testid={`badge-count-${color}`}>
                  {groupedByColor[color].reduce((sum, t) => sum + t.quantity, 0)} total
                </Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Size
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Quantity
                      </span>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {groupedByColor[color].map((tshirt, index) => (
                    <tr
                      key={tshirt.id}
                      className="hover-elevate"
                      data-testid={`row-tshirt-${color}-${index}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium" data-testid={`text-size-${color}-${index}`}>
                          {tshirt.size}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium" data-testid={`text-quantity-${color}-${index}`}>
                          {tshirt.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(tshirt)}
                            data-testid={`button-edit-${color}-${index}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tshirt)}
                            data-testid={`button-delete-${color}-${index}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile View - Grouped by Color */}
      <div className="md:hidden space-y-6">
        {colors.map((color) => (
          <Card key={color} className="overflow-hidden" data-testid={`color-group-mobile-${color}`}>
            <div className="bg-muted/50 px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold" data-testid={`text-color-header-mobile-${color}`}>
                  {color}
                </h3>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-count-mobile-${color}`}>
                  {groupedByColor[color].reduce((sum, t) => sum + t.quantity, 0)}
                </Badge>
              </div>
            </div>
            <div className="divide-y">
              {groupedByColor[color].map((tshirt, index) => (
                <div
                  key={tshirt.id}
                  className="p-4 flex items-center justify-between gap-4"
                  data-testid={`card-tshirt-${color}-${index}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Size
                      </span>
                      <span className="font-medium" data-testid={`text-size-mobile-${color}-${index}`}>
                        {tshirt.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
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
                      onClick={() => onEdit(tshirt)}
                      data-testid={`button-edit-mobile-${color}-${index}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(tshirt)}
                      data-testid={`button-delete-mobile-${color}-${index}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
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
