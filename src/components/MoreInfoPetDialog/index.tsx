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
} from "@/src/components/ui"
import React, { useState } from "react"
import { Straypet } from "@/src/types/straypets"
import { getTimeDifference } from "@/src/utils/getTimeDifference"

type AddStrayPetDialogProps = {
    strayPet: Straypet
    children: JSX.Element
};

export default function MoreInfoDialog(props: AddStrayPetDialogProps) {
    const [open, setOpen] = useState<boolean>(false)

    return (
       <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               {props.children}
            </DialogTrigger>
            <DialogContent className="rounded-2xl w-[350px] w-max-[90%] dark:bg-[#222] dark:border-none">
                    <DialogHeader>
                    <DialogTitle className="mb-8 text-2xl text-center dark:text-white">{props.strayPet.Animal}</DialogTitle>
                        <DialogDescription className="mt-2 text-center">
                            <img src={props.strayPet.ImageURL} className="mx-auto w-32 h-32 rounded-[100px]"/>
                            <p className="text-[#333] dark:text-[#e0e0e0] text-lg font-medium mt-1">{props.strayPet.Status}</p>
                            <p className="mt-2 dark:text-[#e0e0e0]">{getTimeDifference(props.strayPet.CreatedAt)}</p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" className="w-full mt-8 hover:bg-[#2e2e2e] transition dark:bg-white dark:text-black dark:hover:bg-[#d9d9d9]">Close</Button>
                        </DialogClose>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
       </> 
    )
}