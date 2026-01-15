import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHumanRooms } from "@/data-access/human-rooms";
import { SearchBar } from "./search-bar";
import HumanRoomContent from "./HumanRoomContent";

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
      <HumanRoomContent rooms={rooms} searchTerm={searchParams.search} />
    </main>
  );
}
