"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  search: z.string().min(0).max(50),
});

/**
 * SearchBar Component for Human Interview Room List Page
 * 
 * Originally located at: app/human/search-bar.tsx
 * Moved to: components/human/SearchBar.tsx (January 16, 2026)
 * 
 * Features:
 * - Search input with validation (max 50 characters)
 * - Auto-submit with 300ms debounce (reduces server load)
 * - Manual search button for immediate submission
 * - Clear button to reset search
 * - ARIA label for accessibility
 * 
 * Debouncing Logic:
 * - User types → 300ms delay → automatic search
 * - User clicks Search button → immediate search (bypasses debounce)
 * - Prevents unnecessary server requests during fast typing
 * 
 * Used in: app/human/page.tsx
 */
export function SearchBar() {
  const router = useRouter();
  const query = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: query.get("search") || "",
    },
  });

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Watch search field for changes and debounce navigation
  const searchValue = form.watch("search");

  useEffect(() => {
    // Clear existing timer on each keystroke
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for 300ms
    debounceTimerRef.current = setTimeout(() => {
      // Only navigate if value actually changed from URL param
      const currentSearch = query.get("search") || "";
      if (searchValue !== currentSearch) {
        if (searchValue.trim()) {
          router.push(`/human/?search=${encodeURIComponent(searchValue)}`);
        } else if (currentSearch) {
          // If search is cleared, remove param
          router.push("/human");
        }
      }
    }, 300);

    // Cleanup timer on unmount or when searchValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchValue, router, query]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Manual submit (clicking Search button)
    // Clear debounce timer and navigate immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (values.search) {
      router.push(`/human/?search=${encodeURIComponent(values.search)}`);
    } else {
      router.push("/human");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex items-center gap-4"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full max-w-md"
                  placeholder="Filter rooms by keyword..."
                  aria-label="Search interview rooms by name or language"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="dashboardAiOrHuman" type="submit">
          <SearchIcon className="mr-2"></SearchIcon>Search
        </Button>

        {query.get("search") && (
          <Button
            variant="dashboard"
            onClick={() => {
              form.setValue("search", "");
              router.push("/human");
            }}
          >
            Clear
          </Button>
        )}
      </form>
    </Form>
  );
}
