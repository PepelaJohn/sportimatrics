'use client'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux";

export default function SonnerDemo() {
  const popup = useSelector((state:any) => state.info);

  return (
    <Button
    className="mt-[200px] text-white-1"
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => {}
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}

  