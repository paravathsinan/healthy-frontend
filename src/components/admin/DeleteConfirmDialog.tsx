"use client";

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. This item will be permanently removed.",
  isLoading = false
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        
        <AlertDialogHeader className="space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-2">
            <Trash2 className="h-8 w-8 text-red-500" />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-gray-900 font-heading">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 font-medium text-[15px] leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-8 flex gap-3">
          <AlertDialogCancel 
            disabled={isLoading}
            className="flex-1 rounded-2xl border-gray-100 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 font-bold py-6 h-auto transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold py-6 h-auto border-none shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
