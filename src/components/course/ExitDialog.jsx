import React from "react";
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

export default function ExitDialog({ open, onContinue, onFinish }) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onContinue()}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Leaving so soon?</AlertDialogTitle>
          <AlertDialogDescription>
            Your progress is saved. Would you like to continue learning or end the session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pb-safe">
          <AlertDialogCancel onClick={onContinue}>Continue Course</AlertDialogCancel>
          <AlertDialogAction onClick={onFinish} className="bg-slate-800 hover:bg-slate-900">
            Finish Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}