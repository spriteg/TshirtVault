import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";

interface TshirtEmptyStateProps {
  onAddNew: () => void;
}

export function TshirtEmptyState({ onAddNew }: TshirtEmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No t-shirts yet</h2>
        <p className="text-muted-foreground mb-6">
          Start building your inventory by adding your first t-shirt. Track sizes, 
          colors, and keep everything organized in one place.
        </p>
        <Button onClick={onAddNew} size="lg" data-testid="button-add-first-tshirt">
          <Plus className="w-5 h-5 mr-2" />
          Add Your First T-Shirt
        </Button>
      </div>
    </Card>
  );
}
