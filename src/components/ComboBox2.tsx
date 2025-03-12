"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumRange } from "@/app/(Navbar)/(root)/insights/page";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function ComboboxDemo({
  num,
  setNum,
}: {
  num: NumRange;
  setNum: React.Dispatch<React.SetStateAction<NumRange>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [number, setNumber] = React.useState<NumRange>(5);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-white-2 border-gray-700"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Entries"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0  bg-black-1 border border-gray-700  text-white-2">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandList>
            <CommandGroup>
              <input
                type="number"
                min={5}
                max={20}
                className="w-full border text-white-2  bg-transparent h-8"
                value={number}
                onChange={(e) =>
                  setNumber(e.target.value as unknown as NumRange)
                }
              />
            </CommandGroup>
            <CommandEmpty>
              <Button
                variant="outline"
                role="button"
                aria-expanded={open}
                onClick={() => {
                  // alert(!!number && number >= 5)
                  if (!!number && number >= 5 && number <= 20) {
                    setNum(number);
                  } else if (number > 20) {
                    setNum(20);
                  } else if (number < 5) {
                    setNum(5);
                  }
                  setOpen(false);
                }}
                className="w-[150px] flex items-center justify-center mx-auto border-gray-700"
              >
                Select
              </Button>
            </CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
