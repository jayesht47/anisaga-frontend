import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createNewCustomList } from '@/lib/actions';

interface NewCustomListDialogProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    updateCustomList: () => Promise<void>;
}

export default function NewCustomListDialog({
    openDialog,
    setOpenDialog,
    updateCustomList,
}: NewCustomListDialogProps) {
    const currentPathName = usePathname();
    const [isPending, setIsPending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const slug = currentPathName?.split('/')[2];

    const submitClickHandler = async () => {
        setErrorMsg('');
        const listName = (
            document.querySelector('#newListName') as HTMLInputElement
        ).value;
        if (listName.trim().length < 1) {
            setErrorMsg('List name cannot be blank');
            return;
        }
        setIsPending(true);
        const resp = await createNewCustomList(listName, slug);
        setIsPending(false);
        if (resp.error === 'true') {
            setErrorMsg('Internal server error occurred');
            return;
        }
        setOpenDialog(false);
        updateCustomList();
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create New Custom List</DialogTitle>
                    <DialogDescription>
                        Add Anime to a new custom list
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                            Name
                        </Label>
                        <Input id='newListName' className='col-span-3' />
                    </div>
                </div>
                <DialogFooter>
                    <div className='flex flex-col'>
                        {!isPending && (
                            <Button
                                type='submit'
                                className='hover:cursor-pointer'
                                onClick={submitClickHandler}
                            >
                                Create
                            </Button>
                        )}
                        {errorMsg.length > 0 && (
                            <span className='font-semibold text-red-400'>
                                {errorMsg}
                            </span>
                        )}
                        {isPending && (
                            <Button disabled>
                                <Loader2 className='animate-spin' />
                                Please wait
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
