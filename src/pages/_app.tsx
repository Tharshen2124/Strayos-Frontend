import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { Hanken_Grotesk } from 'next/font/google'
import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";
import Cookies from 'js-cookie'
import { ToastProvider } from "../components/ui/toast";
import { Toaster } from "../components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { clientId } from "../utils/env";

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setToken(token); // Restore token to Zustand state from cookies
    }
  }, [setToken]);


  return (
    <main className={hankenGrotesk.className}>
      <GoogleOAuthProvider clientId={clientId}>
        <ToastProvider>
          <Component {...pageProps}/>
          <Toaster />
        </ToastProvider>   
      </GoogleOAuthProvider>
    </main>
  )
}
