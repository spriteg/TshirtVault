import { type Tshirt, insertTshirtSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TshirtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tshirt: Tshirt | null;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COMMON_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#808080" },
  { name: "Navy", value: "#001F3F" },
  { name: "Red", value: "#FF4136" },
  { name: "Blue", value: "#0074D9" },
  { name: "Green", value: "#2ECC40" },
  { name: "Yellow", value: "#FFDC00" },
  { name: "Orange", value: "#FF851B" },
  { name: "Purple", value: "#B10DC9" },
  { name: "Pink", value: "#F012BE" },
  { name: "Maroon", value: "#85144B" },
];

export function TshirtDialog({ open, onOpenChange, tshirt }: TshirtDialogProps) {
  const { toast } = useToast();
  const isEditing = !!tshirt;

  const form = useForm({
    resolver: zodResolver(insertTshirtSchema),
    defaultValues: {
      size: "",
      color: "#FFFFFF",
    },
  });

  useEffect(() => {
    if (open) {
      if (tshirt) {
        form.reset({
          size: tshirt.size,
          color: tshirt.color,
        });
      } else {
        form.reset({
          size: "",
          color: "#FFFFFF",
        });
      }
    }
  }, [open, tshirt, form]);

  const createMutation = useMutation({
    mutationFn: async (data: { size: string; color: string }) => {
      return await apiRequest("POST", "/api/tshirts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tshirts"] });
      toast({
        title: "T-Shirt added",
        description: "Your t-shirt has been added successfully.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add t-shirt. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { size: string; color: string }) => {
      return await apiRequest("PUT", `/api/tshirts/${tshirt?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tshirts"] });
      toast({
        title: "T-Shirt updated",
        description: "Your t-shirt has been updated successfully.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update t-shirt. Please try again.",
      });
    },
  });

  const onSubmit = (data: { size: string; color: string }) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-tshirt">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit T-Shirt" : "Add New T-Shirt"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your t-shirt."
              : "Add a new t-shirt to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Size Field */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-size">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size} value={size} data-testid={`option-size-${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Field */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="space-y-3">
                    {/* Color Picker */}
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <div className="relative">
                          <input
                            type="color"
                            {...field}
                            className="sr-only"
                            data-testid="input-color-picker"
                            id="color-picker"
                          />
                          <label
                            htmlFor="color-picker"
                            className="flex items-center gap-3 cursor-pointer hover-elevate active-elevate-2 rounded-md border p-3"
                          >
                            <div
                              className="w-10 h-10 rounded-md border shadow-sm flex-shrink-0"
                              style={{ backgroundColor: field.value }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Custom Color</div>
                              <div className="text-xs text-muted-foreground">
                                {field.value.toUpperCase()}
                              </div>
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="#FFFFFF"
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                          data-testid="input-color-hex"
                        />
                      </FormControl>
                    </div>

                    {/* Common Colors */}
                    <div>
                      <div className="text-sm font-medium mb-2">Common Colors</div>
                      <div className="grid grid-cols-6 gap-2">
                        {COMMON_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => field.onChange(color.value)}
                            className="group relative"
                            title={color.name}
                            data-testid={`button-color-${color.name.toLowerCase()}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-md border-2 shadow-sm transition-all hover-elevate ${
                                field.value.toUpperCase() === color.value.toUpperCase()
                                  ? "border-primary ring-2 ring-primary ring-offset-2"
                                  : "border-border"
                              }`}
                              style={{ backgroundColor: color.value }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-submit">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Update" : "Add"} T-Shirt
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
