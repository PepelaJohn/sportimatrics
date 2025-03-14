"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "months",
    label: "Months",
  },
  {
    value: "days",
    label: "Days",
  },
  {
    value: "years",
    label: "Years",
  },
  {
    value: "custom",
    label: "Custom",
  },
  
  
]

type InDtype = 'days'| 'months' | 'years' | "custom"

type Props = {
    value: InDtype
    setValue:React.Dispatch<React.SetStateAction<InDtype>>
}

export function ComboboxDemo({value, setValue} :Props) {
  const [open, setOpen] = React.useState(false)


  return (
    <Popover open={open}  onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between text-white-2 border-gray-700"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select frequency"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-black-1 border border-gray-700 text-white-2 p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue as InDtype)
                    console.log(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-white-2",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
