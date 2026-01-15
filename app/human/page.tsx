import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/utils/schema";
import { GithubIcon } from "lucide-react";
import { getHumanRooms } from "@/data-access/human-rooms";
import { LanguagesList } from "@/components/code-editor/languages-list";
import { splitLanguages } from "@/lib/utils";
import { SearchBar } from "./search-bar";
import RoomCard from "@/components/human/RoomCards";

export default async function HumanInterviewRoom({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const rooms = await getHumanRooms(searchParams.search || "");
  return (
    <main className="min-h-screen p-16">
      <div className="flex justify-between w-full items-center mb-10">
        <h1 className="text-4xl text-white">Find Interview Room</h1>
        <Button variant={"dashboardAiOrHuman"} asChild>
          <Link href="/human/create-room">Create Room</Link>
        </Button>
      </div>
      <div className="mb-12">
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-muted-foreground mb-2">
              {searchParams.search 
                ? `No rooms found for "${searchParams.search}"`
                : "No interview rooms available yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchParams.search 
                ? "Try a different search term"
                : "Create the first room to get started"}
            </p>
            {!searchParams.search && (
              <Button variant="dashboardAiOrHuman" asChild>
                <Link href="/human/create-room">Create Room</Link>
              </Button>
            )}
          </div>
        ) : (
          rooms.map((room) => {
            return <RoomCard key={room.id} room={room} />;
          })
        )}
      </div>
    </main>
  );
}
