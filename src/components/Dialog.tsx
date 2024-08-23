import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DialogCloseButton({
  children,
  heading,
  text,
}: {
  children: React.ReactNode;
  heading: string;
  text: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[400px] border-gray-1 bg-black-1 text-white-2">
        <DialogHeader>
          <DialogTitle className="uppercase text-[15px] text-white-1">{heading}</DialogTitle>
          
        </DialogHeader>
        <div className="text-sm">{text}</div>
        <DialogFooter className="sm:justify-end text-white-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DialogCloseButton;
