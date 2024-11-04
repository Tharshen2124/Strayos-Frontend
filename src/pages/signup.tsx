import { useState } from "react";
import { Button, Input, Label } from "../components/ui";
import axios, { AxiosResponse } from "axios";
import { apiUrl } from "../utils/env";
import { useRouter } from "next/router";
import useAuthStore from "../store/useAuthStore";
import { useToast } from "../hooks/use-toast";
import { ToastAction } from "../components/ui/toast";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

export default function Signup() {
    const { toast } = useToast()
    const [username, setUsername] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [confirmPassword, setConfirmPassword] = useState<string>()
    const router = useRouter()
    const { setToken } = useAuthStore.getState()

    const HandleGoogleLoginOAuth = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
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
                        title: "Noice! You're logged in.",
                        action: (
                          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                        ),
                      })
                    setToken(response.data.token)
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
                console.error("Error occured during google login: ", error)
            }
        }
    })

    async function handleSubmit(event: any) {
        event.preventDefault()
        if (password !== confirmPassword) {
            console.log("Password doesn't match")
            return 
        }
        try {
            const response: AxiosResponse = await axios.post(`${apiUrl}/signup`, {
                "username": username,
                "email": email,
                "password": password,
            }, {
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                  }
            })

            if(response.data.token) { 
                toast({
                    title: "Noice! You're logged in.",
                    action: (
                      <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    ),
                  })
                setToken(response.data.token)
                router.push('/')
            } else {
                toast({
                    title: "Uh Oh! An error occured.",
                    description: "Try again",
                    variant: "destructive",
                  })
                console.log("No Token")
            }
            
        } catch (error: any) {
            toast({
                title: "Uh Oh! An error occured.",
                description: "Try again",
                variant: "destructive",
              })
            console.log("Error occured", error)
        }
    }

    return (
    <>
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
            <img src="/dog.jpg" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-1 dark:text-white">Welcome to Strayos!</h1>
            <p className="text-[#555] mb-5 dark:text-[#d9d9d9]">Sign up and start finding some strays.</p>
            <form action="#" method="POST">
                <div className="mb-4">
                    <Label className=" text-gray-600 mb-2 dark:text-[#c2c2c2]">Username</Label>
                    <Input type="text" onChange={(e: any) => setUsername(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <Label className=" text-gray-600 mb-2 dark:text-[#c2c2c2]">Email</Label>
                    <Input type="email" onChange={(e: any) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <Label className=" text-gray-600 mb-2 dark:text-[#c2c2c2]">Password</Label>
                    <Input type="password" onChange={(e: any) => setPassword(e.target.value)} />
                </div>
                <div className="mb-10">
                    <Label className=" text-gray-600 mb-2 dark:text-[#c2c2c2]">Confirm Password</Label>
                    <Input type="password" onChange={(e: any) => setConfirmPassword(e.target.value)}/>
                </div>
             
                <Button type="submit" className="w-full mb-2 dark:bg-[#333]" onClick={handleSubmit}>Login</Button>
                <Button variant={"outline"} type="button" className="w-full mb-2" onClick={() => HandleGoogleLoginOAuth()}>
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
            </form>
            </div>
        </div>
    </>
    )
}