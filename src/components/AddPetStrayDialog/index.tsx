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
    Label,
    Select,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/src/components/ui"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { apiUrl } from "@/src/utils/env"
import useAuthStore from "@/src/store/useAuthStore"
import { useToast } from "@/src/hooks/use-toast"
import { useRouter } from "next/router"
import { SelectTrigger } from "@radix-ui/react-select"

type AddStrayPetDialogProps = {
    latitude: number;
    longitude: number;
};

export default function AddStrayPetDialog(props: AddStrayPetDialogProps) {
    const { toast } = useToast()
    const [animal, setAnimal] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [image, setImage] = useState<any>(null)
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

        if(!animal) {
            toast({
                title: "Please select an animal type...",
                variant: "destructive",
            })
            return
        }

        if(!status) {
            toast({
                title: "Add some status to the stray...",
                variant: "destructive",
            })
            return
        }

        if(!image) {
            toast({
                title: "Add a picture of it...",
                variant: "destructive",
            })
            return
        }

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
        body.append("Longitude", props.longitude.toString())

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

            setAnimal("")
            setStatus("")
            setImage(null)

            router.reload()
        } catch(error: any) {
            toast({
                title: "Uh Oh! An error occured.",
                description: "Try again",
                variant: "destructive",
            })
            console.error("Error occured", error)

            setAnimal("")
            setStatus("")
            setImage(null)
        }
    }

    return (
       <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute left-1/2 bottom-[30px] transform -translate-x-1/2 bg-white text-black hover:bg-slate-100 rounded-[5px] shadow-sm text-md px-10 py-6 dark:text-white dark:bg-black dark:hover:bg-[#333]">Add a Stray</Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-black dark:border-none text-start">
                <form>
                    <DialogHeader>
                    <DialogTitle className="mb-8 text-2xl dark:text-white">Add Stray</DialogTitle>
                        <div>
                            <DialogDescription className="mt-2 flex flex-col">
                                <Label className="dark:text-[#d9d9d9]">Animal</Label>
                                <Select name="animal" onValueChange={(value) => setAnimal(value)}>
                                    <SelectTrigger className="mt-2 dark:text-white text-start px-3 border-[1px] focus:dark:border-white py-[5px] rounded-lg dark:border-[#333] ">
                                        <SelectValue placeholder="Select an animal" className="w-full border-2 dark:border-[#c03c3c]" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cat">Cat</SelectItem>
                                        <SelectItem value="Dog">Dog</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DialogDescription>
                        </div>
                        <div>
                            <DialogDescription className="mt-2">
                                <Label className="dark:text-[#d9d9d9]">Status</Label>
                                <Input className="mt-2 dark:text-white dark:border-[#333] dark:focus:border-white" onChange={(e) => setStatus(e.target.value)}/>
                            </DialogDescription>
                        </div>
                        <div>
                            <DialogDescription className="mt-2">
                                <Label className="dark:text-[#d9d9d9]">Image</Label>
                                <Input className="mt-2 text-white dark:text-black dark:bg-white dark:border-[#333] dark:focus:border-white" type="file" onChange={uploadToClient}/>
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