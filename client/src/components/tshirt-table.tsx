import { type Tshirt } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteTshirtDialog } from "@/components/delete-tshirt-dialog";
import { useState } from "react";

interface TshirtTableProps {
  tshirts: Tshirt[];
  onEdit: (tshirt: Tshirt) => void;
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

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Size
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Color
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Quantity
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tshirts.map((tshirt, index) => (
                  <tr 
                    key={tshirt.id}
                    className="hover-elevate"
                    data-testid={`row-tshirt-${index}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" data-testid={`text-size-${index}`}>
                        {tshirt.size}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" data-testid={`text-color-${index}`}>
                        {tshirt.color}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" data-testid={`text-quantity-${index}`}>
                        {tshirt.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(tshirt)}
                          data-testid={`button-edit-${index}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(tshirt)}
                          data-testid={`button-delete-${index}`}
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
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {tshirts.map((tshirt, index) => (
          <Card key={tshirt.id} className="p-4" data-testid={`card-tshirt-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Size
                  </span>
                  <span className="font-medium" data-testid={`text-size-mobile-${index}`}>
                    {tshirt.size}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Color
                  </span>
                  <span className="text-sm truncate" data-testid={`text-color-mobile-${index}`}>
                    {tshirt.color}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Qty
                  </span>
                  <span className="text-sm font-medium" data-testid={`text-quantity-mobile-${index}`}>
                    {tshirt.quantity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tshirt)}
                  data-testid={`button-edit-mobile-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(tshirt)}
                  data-testid={`button-delete-mobile-${index}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
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
