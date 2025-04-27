"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { auth } from '../firebase'

export default function Navbar() {
  const [fullName, setFullName] = useState("Login")
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserData = async () => {
      const db = getFirestore()
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setFullName("Logged in as " + userData.name)
        } else {
          console.error("No user document found!")
        }
      }
    }
    fetchUserData();
  }, [])

  const routes = [
    { name: "Home", path: "/" },
    { name: "History", path: "/history" },
    { name: fullName, path: "/auth" },
  ]

  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              LOCK IN
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  pathname === route.path ? "text-red-500" : "text-gray-400"
                }`}
              >
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-800">
              <nav className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`text-lg font-medium transition-colors hover:text-red-500 ${
                      pathname === route.path ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {route.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
