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

const SIZES = ["S", "M", "L", "XL", "XXL"];

export function TshirtDialog({ open, onOpenChange, tshirt }: TshirtDialogProps) {
  const { toast } = useToast();
  const isEditing = !!tshirt;

  const form = useForm({
    resolver: zodResolver(insertTshirtSchema),
    defaultValues: {
      size: "",
      color: "",
      quantity: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (tshirt) {
        form.reset({
          size: tshirt.size,
          color: tshirt.color,
          quantity: tshirt.quantity,
        });
      } else {
        form.reset({
          size: "",
          color: "",
          quantity: 0,
        });
      }
    }
  }, [open, tshirt, form]);

  const createMutation = useMutation({
    mutationFn: async (data: { size: string; color: string; quantity: number }) => {
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
    mutationFn: async (data: { size: string; color: string; quantity: number }) => {
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

  const onSubmit = (data: { size: string; color: string; quantity: number }) => {
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
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
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Red, Blue, Green"
                      {...field}
                      disabled={isEditing}
                      data-testid="input-color"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity Field */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-quantity"
                    />
                  </FormControl>
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
