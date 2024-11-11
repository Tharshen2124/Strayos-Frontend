"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    Input,
    Label
} from "@/src/components/ui"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { apiUrl } from "@/src/utils/env"
import useAuthStore from "@/src/store/useAuthStore"
import { useToast } from "@/src/hooks/use-toast"
import { useRouter } from "next/router"

type AddStrayPetDialogProps = {
    latitude: number;
    longitude: number;
};

export default function AddStrayPetDialog(props: AddStrayPetDialogProps) {
    const { toast } = useToast()
    const [animal, setAnimal] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [image, setImage] = useState<any>()
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const { token } = useAuthStore.getState()

    const uploadToClient = (e: any) => {
        if (e.target.files && e.target.files[0]) {
          const i = e.target.files[0]
          setImage(i)
        }
    }

    async function handleSubmit(event: any) {
        event.preventDefault()

        setOpen(false);
        toast({
            title: "Adding the stray to our database...",
            description: "Give it some time ya lol",
        })
        
        const body = new FormData()
        body.append("Animal", animal)
        body.append("Status", status)
        body.append("UserId", "3")
        body.append("Image", image)
        body.append("Latitude", props.latitude.toString())
        body.append("Longitude", props.latitude.toString())

        console.log("Image", image)

        try {
            const response: AxiosResponse = await axios({
                method: "POST",
                url: `${apiUrl}/stray-pets`,
                data: body,
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("response", response.data)
            toast({
                title: "Noice! You've added a stray.",
            })
            router.reload()
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute left-1/2 bottom-[30px] transform -translate-x-1/2 bg-white text-black hover:bg-slate-100 rounded-[5px] shadow-sm text-md px-10 py-6 dark:text-white dark:bg-black dark:hover:bg-[#333]">Add a Stray</Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-[#222] dark:border-none text-start">
                <form>
                    <DialogHeader>
                    <DialogTitle className="mb-8 text-2xl dark:text-white">Add Stray</DialogTitle>
                        <div>
                            <DialogDescription className="mt-2">
                                <Label className="dark:text-[#d9d9d9]">Animal</Label>
                                <Input className="mt-2 dark:text-white" onChange={(e) => setAnimal(e.target.value)}/>
                            </DialogDescription>
                        </div>
                        <div>
                            <DialogDescription className="mt-2">
                                <Label className="dark:text-[#d9d9d9]">Status</Label>
                                <Input className="mt-2 dark:text-white" onChange={(e) => setStatus(e.target.value)}/>
                            </DialogDescription>
                        </div>
                        <div>
                            <DialogDescription className="mt-2">
                                <Label className="dark:text-[#d9d9d9]">Image</Label>
                                <Input className="mt-2 dark:text-white dark:bg-[#555] dark:border-[#555]" type="file" onChange={uploadToClient}/>
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" className="w-full mt-8 hover:bg-[#2e2e2e] transition dark:bg-white dark:hover:bg-[#d9d9d9] dark:text-black" onClick={handleSubmit}>Submit</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
       </> 
    )
}