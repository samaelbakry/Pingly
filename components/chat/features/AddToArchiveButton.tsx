"use client"

import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

export default function AddToArchiveButton({setShowArchived ,showArchived }:{setShowArchived: Dispatch<SetStateAction<boolean>>; showArchived: boolean}) {
  return (
    <>
       <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowArchived((prev) => !prev)}
          className="gap-2"
        >
          <Archive className="size-4" />

          {showArchived ? "Hide archived" : "Show archived"}
        </Button>
    </>
  )
}
