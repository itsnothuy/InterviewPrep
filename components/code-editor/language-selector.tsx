"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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
import { LANGUAGE_VERSIONS, Language } from "@/components/chat/code-constants";

const languages = Object.entries(LANGUAGE_VERSIONS) as [Language, string][];

interface LanguageSelectorProps {
  language: [Language, string];
  onSelect: (language: [Language, string]) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<[Language, string]>(language);

  // P1.4: Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mb-5">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select programming language"
          aria-haspopup="listbox"
          className="w-[200px] justify-between"
          onKeyDown={handleKeyDown}
        >
          {value ? value[0] : "Select language..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" role="listbox">
        <Command>
          <CommandInput 
            placeholder="Search language..." 
            className="h-9"
            aria-label="Search programming languages"
          />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map(([lang, version]) => (
                <CommandItem
                  key={lang}
                  value={lang}
                  role="option"
                  aria-selected={value[0] === lang}
                  onSelect={() => {
                    const selectedValue: [Language, string] = [lang, version];
                    setValue(selectedValue);
                    onSelect(selectedValue);
                    setOpen(false);
                  }}
                >
                  {lang}
                  <span className="text-gray-600 text-sm ml-2">{version}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value[0] === lang ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
