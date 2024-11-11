import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "../components/ui"
import { Label } from "@radix-ui/react-dropdown-menu"
import { apiUrl } from "../utils/env"
import useAuthStore from "../store/useAuthStore"
import { useToast } from "../hooks/use-toast"
import { ToastAction } from "../components/ui/toast"
import Image from "next/image"
import { useGoogleLogin } from "@react-oauth/google"

export default function LoginCard() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()
  const { setToken, token } = useAuthStore.getState()

  useEffect(() => {
    if(isLoading) {
      setIsLoading(false)
      return
    }
    if(token && token !== 'No Value') {
      router.push('/home')
    }
  }, [isLoading])

  const HandleGoogleLoginOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
          toast({
            title: "Attempting your login...",
            description: "Gotta check if you're not animal control :P",
          })
          try {
              const response: AxiosResponse = await axios.post(`${apiUrl}/google-oauth/login`,{ 
                      "accessToken": tokenResponse.access_token
                  },{ 
                      headers: {
                          'Content-Type': "application/json",
                          'Accept': "application/json"
                      }
                  }
              );

              if(response.data.token) { 
                  toast({
                      title: "Nice! You're logged in.",
                    })
                  setToken(response.data.token)
                  router.push('/home')
              } else {
                  toast({
                      title: "Uh Oh! An error occured.",
                      description: "Try again",
                      variant: "destructive",
                  })
                  console.log("No Token")
              }
              
          } catch(error: any) {
            console.error("Error occured during google login: ", error)
          }
      }
  })

  async function loginUser() {
    try {
      const response: AxiosResponse = await axios.post(`${apiUrl}/login`, {
        "email": email,
        "password": password
      }, {
        headers: {
          'Content-Type': "application/json",
          'Accept': "application/json"
        }
      })

      if(response.data.token) {
        toast({
          title: "Noice! You're logged in.",
        })
        setToken(response.data.token); // Save token in Zustand and cookies
        router.push('/')
      } else {
        toast({
          title: "Uh Oh! An error occured.",
          description: "Try again",
          variant: "destructive",
        })
        console.log("No Token")
      }           


    } catch(error: any) {
      toast({
        title: "Uh Oh! An error occured.",
        description: "Try again",
        variant: "destructive",
      })
      console.error("Error occured", error)
    }
  }
 
  return (
    <>
    <div className="h-screen flex items-center">
      <Card className="mx-auto max-w-sm dark:bg-[#222] border-none">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-white">Login</CardTitle>
          <CardDescription className="dark:text-[#d9d9d9]">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="dark:text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label className="dark:text-white">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline dark:text-white">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                required 
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-[#333]" onClick={loginUser}>
              Login
            </Button>
            <Button variant="outline" className="w-full" onClick={() => HandleGoogleLoginOAuth()}>
              <Image
                priority
                src="/GoogleIcon.svg"
                height={18}
                width={18}
                alt="Follow us on Twitter"
                className="mr-2"
              />
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm dark:text-white">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}