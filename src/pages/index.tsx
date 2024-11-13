import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

export default function Landing() {
    const [isDarkMode, setDarkMode] = useState<boolean>(false)
    const { token } = useAuthStore.getState()
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

    function handleLogin() {
        if(token && token !== 'No Value') {
            router.push('/home')
        } else {
            router.push('/login')
        }
    }



  return (
    <>
        <div className="h-screen flex flex-col">
    <nav className="flex justify-between my-6 sm:mx-10 mx-6">
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
        <div className="flex items-center md:gap-x-16 gap-x-8 font-semibold">
            <div onClick={() => handleLogin()} className="dark:text-white md:text-md text-sm md:block hidden">Sign in</div>
            <button className="rounded-[100px] py-2 md:px-8 px-6 font-bold bg-black text-white dark:bg-white dark:text-black md:text-md text-sm" onClick={() => router.push("/signup")}>Sign up</button>
        </div>
    </nav>
    <div 
        style={{
            backgroundImage: "url('/strayCat.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
        className="flex-1 flex items-center" // Added flex and items-center
    >
        <div className="mx-[60px]"> {/* Added margin here instead */}
            <h1 className="md:text-[3.4rem] text-[1.8rem] sm:text-[2.2rem] font-bold text-white">Where Animal Lovers </h1>
            <h1 className="md:text-[3.4rem] text-[1.8rem] sm:text-[2.2rem] font-bold text-white">Meet Street Souls</h1>
            <div className="md:flex mt-4 block">
                <button className="rounded-[100px] py-3 md:px-16 px-8 md:text-md text-sm font-bold bg-white text-black" onClick={() => handleLogin()}>Sign in</button>
                <div className="md:ml-5 mt-5 md:mt-0">
                    <p className="text-white">Don&apos;t have an account?</p>
                    <Link href="/signup" className="text-white font-bold hover:underline">Sign up here!</Link>
                </div>
            </div>
        </div>
    </div>
</div>
    </>
  )
}
