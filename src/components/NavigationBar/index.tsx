"use client"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Sheet, SheetContent, SheetTrigger
} from "@/src/components/ui"
import { CircleUser, Menu, Package2 } from "lucide-react"
import useAuthStore from "@/src/store/useAuthStore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Image from "next/image"

export function NavigationBar() {
    const [isDarkMode, setDarkMode] = useState<boolean>(false)
    const { clearToken } = useAuthStore.getState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
                setDarkMode(e.matches);
            }
            mediaQuery.addEventListener('change', handleChange);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            }
        }
    }, [])
    
    function HandleLogout() {
        clearToken()
        router.push('/login')
    }
    return (
        <>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-white dark:bg-black dark:border-none">
            <div>
                {isDarkMode ?
                    <Image
                        src="/LogoDark.svg" 
                        width={120} 
                        height={120} 
                        alt="logo dog"
                    /> 
                : 
                    <Image 
                            src="/Logo.svg" 
                            width={120} 
                            height={120} 
                            alt="logo cat"
                    />
                }
            </div>
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/home" className="text-muted-foreground transition-colors hover:text-foreground dark:text-[#e0e0e0] font-semibold dark:hover:text-white">Home</Link>
                <Link href="/missing-pets" className="w-[84px] text-muted-foreground transition-colors hover:text-foreground dark:text-[#e0e0e0] font-semibold dark:hover:text-white">Missing Pets</Link>
            </nav>
            
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="hidden sm:flex flex-col rounded-lg dark:bg-[#333] hover:bg-[#555]">
                        <CircleUser className="h-5 w-5 dark:text-white " />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="dark:text-white">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={HandleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 sm:hidden bg-[#333] border-none hover:bg-[#555]"
                    >
                        <Menu className="h-5 w-5 flex text-white" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="dark:bg-[#222] border-none">
                    <nav className="grid gap-6 text-lg font-medium">
                    {isDarkMode ?
                        <Image
                            src="/LogoDark.svg" 
                            width={120} 
                            height={120} 
                            alt="logo dog"
                        /> 
                    : 
                        <Image 
                                src="/Logo.svg" 
                                width={120} 
                                height={120} 
                                alt="logo cat"
                        />
                    }
                    <Link href="/home" className="text-muted-foreground hover:text-foreground dark:text-[#d9d9d9] dark:hover:text-white">
                        Home
                    </Link>
                    <Link href="/missing-pets" className="text-muted-foreground hover:text-foreground dark:text-[#d9d9d9] dark:hover:text-white">
                        Stray
                    </Link>
                    <Link onClick={HandleLogout} href="/missing-pets" className="mt-10 font-semibold text-muted-foreground hover:text-foreground dark:text-[#d9d9d9] hover:text-white">
                        Logout
                    </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            </div>
            
      </header>
        </>
    )
}