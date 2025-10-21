import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface SizeFilterProps {
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  onClearAll: () => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function SizeFilter({ selectedSizes, onSizeToggle, onClearAll }: SizeFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-filter">
          <Filter className="w-4 h-4" />
          Size
          {selectedSizes.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 min-w-5 h-5 flex items-center justify-center text-xs">
              {selectedSizes.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filter by Size</h4>
            {selectedSizes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 px-2 text-xs"
                data-testid="button-clear-size-filters"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <Button
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSizeToggle(size)}
                  className="relative"
                  data-testid={`button-size-filter-${size}`}
                >
                  {size}
                  {isSelected && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
