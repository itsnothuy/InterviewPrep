// "use client";

// import { Button } from "@/components/ui/button";
// import { signIn, signOut, useSession } from "next-auth/react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { LogIn, LogInIcon, LogOut } from "lucide-react";
// import Image from "next/image";

// function AccountDropdown() {
//     const session = useSession();

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger>
//                 <Button variant={"link"}>
//                     <Avatar className="">
//                         <AvatarImage src={session.data?.user?.image ?? ""}/>
//                     </Avatar>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-surface text-text">
//                 <DropdownMenuLabel> My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/"})}>
//                     <LogOut className="mr-2" />
//                     SignOut
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }

// export function Header() {
//     const session = useSession();
//     return (
//       <header>
//         <div>
//           {session.data && <AccountDropdown></AccountDropdown>}
//           {!session.data && (
//             <Button onClick={() => signIn()} variant="link" className="text-text hover:text-violet">
//               <LogInIcon className="mr-2" /> Sign In
//             </Button>
//           )}
//         </div>
//       </header>
//     );
//   }

"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogInIcon, LogOut } from "lucide-react";

function AccountDropdown() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9 border border-gray-900">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>
              {session?.user?.name?.slice(0, 2)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-surface text-text ml-4 mt-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center">
      {session ? (
        <AccountDropdown />
      ) : (
        <Button onClick={() => signIn()} variant="link" className="text-text hover:text-violet">
          <LogInIcon className="mr-2 h-4 w-4" /> Sign In
        </Button>
      )}
    </div>
  );
}
