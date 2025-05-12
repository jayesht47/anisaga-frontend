'use client';
import { CircleMinus } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useState } from 'react';
import { Separator } from '../ui/separator';
import { removeFromCustomList } from '@/lib/actions';

interface RemoveFromCustomListButtonProps {
    readonly slug: string;
}

export default function RemoveFromCustomListButton(
    props: RemoveFromCustomListButtonProps
) {
    const currentPathName = usePathname();
    const listName = currentPathName.split('/')[2];
    const [openDialog, setOpenDialog] = useState(false);
    const slug = props.slug;

    const cancelClickHandler = () => {
        setOpenDialog(false);
    };

    const deleteClickHandler = async () => {
        await removeFromCustomList(listName, slug);
        setOpenDialog(false);
        window.location.reload();
    };
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <CircleMinus color='#bd0a37' className='m-1' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove from list</DialogTitle>
                    <DialogDescription>
                        Removes an anime from custom list
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div>
                    <span> Are you sure you want to remove this entry?</span>
                </div>
                <Separator />
                <DialogFooter>
                    <div className='w-full flex justify-between'>
                        <Button onClick={cancelClickHandler}> Cancel </Button>
                        <Button
                            variant={'destructive'}
                            onClick={deleteClickHandler}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
