import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
} from "@/src/components/ui"
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavigationBar } from "../components/NavigationBar"
import useAuthStore from "../store/useAuthStore"
import { useRouter } from "next/router"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuthStore.getState()
  const router = useRouter()
  
  useEffect(() => {
    if(isLoading) {
      setIsLoading(false)
    }
    if (token && token == 'No Value') {
      router.push('/login')
    }
  }, [])

  return (
    <>
    {!isLoading && <NavigationBar/>}
    <div className="w-[95%] mx-auto">
      <div className="text-center my-10 sm:text-2xl lg:text-4xl">
        <h1 className="font-bold">Know any of these pets?</h1>
        <h1 className="font-bold">Help get them back with their owners!</h1>
      </div>
      <div className="flex gap-x-2">
        <Input className="rounded-[100px] h-[55px] pl-7 text-md" placeholder='Search...'/>
        <Button className="w-[55px] h-[55px] rounded-[100px]"><Search width={100}/></Button>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto mt-4">
        <Card className="">
          <div className="flex items-center ml-6">
            <Avatar className="w-[65px] h-[65px]">
              <AvatarImage />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>9:30pm |  12 August 2024</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
          <Button className="w-full">More Info</Button>
          </CardFooter>
        </Card>
        <Card className="">
          <div className="flex items-center ml-6">
            <Avatar className="w-[65px] h-[65px]">
              <AvatarImage />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">More Info</Button>
          </CardFooter>
        </Card>
        <Card className="">
          <div className="flex items-center ml-6">
            <Avatar className="w-[65px] h-[65px]">
              <AvatarImage />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">More Info</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  )
}