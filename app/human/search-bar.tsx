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

const formSchema = z.object({
  search: z.string().min(0).max(50),
});

export function SearchBar() {
  const router = useRouter();
  const query = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: query.get("search") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //invoke server action to store data to our database
    // await createRoomActions({ ...values, createdAt: new Date() });
    // router.push("/human");
    if (values.search) {
      router.push(`/human/?search=${values.search}`);
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
                  className="w-[440px]"
                  placeholder="Filter rooms by keyword..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          <SearchIcon className="mr-2"></SearchIcon>Search
        </Button>

        {query.get("search") && (
          <Button
            variant="link"
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
