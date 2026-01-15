import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHumanRooms } from "@/data-access/human-rooms";
import { SearchBar } from "./search-bar";
import HumanRoomContent from "./HumanRoomContent";

export default async function HumanInterviewRoom({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 12; // 12 rooms per page for a 3x4 grid on desktop
  
  const { rooms, total, totalPages } = await getHumanRooms(
    searchParams.search,
    currentPage,
    pageSize
  );
  
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
      <HumanRoomContent 
        rooms={rooms} 
        searchTerm={searchParams.search}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRooms={total}
      />
    </main>
  );
}
