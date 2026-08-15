// "use client";

// import { Bell, Search } from "lucide-react";

// import ThemeToggle from "./ThemeToggle";
// import Input from "@/components/ui/Input";

// export default function Header() {
//   return (
//     <header
//       className="
//       sticky
//       top-0
//       z-40
//       border-b
//       border-border
//       bg-background/80
//       backdrop-blur-xl
//       "
//     >

//       <div className="container-custom">

//         <div className="flex h-20 items-center justify-between">

//           <div className="w-[420px]">

//             <Input
//               placeholder="Search station, train..."
//               startIcon={<Search size={18} />}
//             />

//           </div>

//           <div className="flex items-center gap-4">

//             <button
//               className="
//               relative
//               flex
//               h-11
//               w-11
//               items-center
//               justify-center
//               rounded-xl
//               border
//               border-border
//               bg-card
//               transition
//               hover:border-primary
//               "
//             >

//               <Bell size={20} />

//               <span
//                 className="
//                 absolute
//                 right-2
//                 top-2
//                 h-2
//                 w-2
//                 rounded-full
//                 bg-red-500
//                 "
//               />

//             </button>

//             <ThemeToggle />

//             <div className="flex items-center gap-3">

//               <img
//                 src="https://i.pravatar.cc/150?img=15"
//                 className="h-11 w-11 rounded-full"
//               />

//               <div>

//                 <h3 className="font-semibold">
//                   Shubham Kumar
//                 </h3>

//                 <p className="text-xs text-muted">
//                   Administrator
//                 </p>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  UserCircle2,
  PanelLeft,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  title?: string;
  description?: string;
  onMenuClick?: () => void;
}

export default function Header({
  title = "Dashboard",
  description = "Welcome back to MetroFlow AI",
  onMenuClick,
}: HeaderProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Metro User");
  const [role, setRole] = useState("Passenger");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const metadata = user?.user_metadata;
      const appRole =
        user?.app_metadata?.role ??
        metadata?.requested_role ??
        "passenger";

      setUserName(
        metadata?.full_name ??
          metadata?.name ??
          user?.email?.split("@")[0] ??
          "Metro User",
      );
      setRole(String(appRole));
    });
  }, []);

  const pageName = pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace("-", " ");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">

      <div className="flex min-h-20 items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">

        <div className="flex items-center gap-5">

          <button
            onClick={onMenuClick}
            className="rounded-xl border border-border p-2 transition hover:bg-muted lg:hidden"
          >
            <PanelLeft size={22} />
          </button>

          <div>

            <h1 className="text-2xl font-black capitalize tracking-tight sm:text-3xl">

              {pageName || title}

            </h1>

            <p className="mt-1 text-sm text-muted">

              {description}

            </p>

          </div>

        </div>

        <div className="hidden w-full max-w-sm items-center rounded-2xl border border-border bg-card px-4 xl:flex">

          <Search
            size={18}
            className="text-muted"
          />

          <input
            type="text"
            placeholder="Search stations, trains..."
            className="h-12 w-full bg-transparent px-3 text-sm outline-none"
          />

        </div>

        <div className="flex items-center gap-4">

          <ThemeToggle />

          <button className="relative rounded-2xl border border-border p-3 transition hover:bg-muted">

            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />

          </button>

          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 transition hover:border-primary"
          >

            <UserCircle2
              size={40}
              className="text-primary"
            />

            <div className="hidden text-left xl:block">

              <h4 className="font-bold">

                {userName}

              </h4>

              <p className="text-xs text-muted">

                {role}

              </p>

            </div>

          </Link>

        </div>

      </div>

    </header>
  );
}
