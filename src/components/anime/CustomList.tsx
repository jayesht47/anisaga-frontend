'use client';
import { addToExistingCustomList, isLoggedIn } from '@/lib/actions';
import { Bookmark, Check, CirclePlus, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { APIResponse } from '@/lib/definitions';
import { getUserLists } from '@/lib/user-apis';
import NewCustomListDialog from './NewCustomListDialog';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';

type ProcessingLists = {
    [key: string]: {
        isProcessing: boolean;
        isSuccess: boolean;
    };
};

export default function CustomList() {
    const [processingLists, setProcessingList] = useState<ProcessingLists>({});
    const [open, setOpen] = useState(false);
    const [authState, setAuthState] = useState(false);
    const [customLists, setCustomLists] = useState<APIResponse>();
    const [openDialog, setOpenDialog] = useState(false);

    const pathname: string = usePathname();
    const slug: string = pathname.split('/')[2];

    useEffect(() => {
        const updateAuthState = async () => {
            setAuthState(await isLoggedIn());
        };
        const updateCustomList = async () => {
            setCustomLists(await getUserLists());
        };

        updateAuthState();
        updateCustomList();
    }, []);

    // Helper to update processing state
    const updateProcessingState = (
        listName: string,
        isProcessing: boolean,
        isSuccess: boolean
    ) => {
        setProcessingList((prev) => ({
            ...prev,
            [listName]: { isProcessing, isSuccess },
        }));
    };

    const listClickHandler = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        const listName = event.currentTarget.dataset.listname as string;
        try {
            updateProcessingState(listName, true, false);
            const responseObject = await addToExistingCustomList(
                listName,
                slug
            );
            if (responseObject.error === 'false') {
                updateProcessingState(listName, false, true);

                // Delay resetting the success state
                setTimeout(
                    () => updateProcessingState(listName, false, false),
                    3000
                );
            }
        } catch (e) {
            console.error('Error occurred adding to list', e);
            updateProcessingState(listName, false, false);
        }
    };

    const renderIcon = (entry: string) => {
        const state = processingLists[entry];
        if (!state || (!state.isProcessing && !state.isSuccess)) {
            return <CirclePlus />;
        }
        if (state.isProcessing) {
            return <LoaderCircle className='animate-spin' />;
        }
        if (state.isSuccess) {
            return <Check color='#30A36C' />;
        }
    };

    return (
        <>
            {authState && (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Bookmark
                            className='ml-5 hover:cursor-pointer self-center'
                            size={40}
                        />
                    </PopoverTrigger>
                    <PopoverContent side='right' align='start' className='p-0'>
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    {customLists &&
                                        (customLists?.data as string[]).length <
                                            5 && (
                                            <CommandItem value='createNewList'>
                                                <span>new list</span>
                                                <Button
                                                    variant='ghost'
                                                    className='p-0! hover:cursor-pointer'
                                                    tabIndex={-1}
                                                    onClick={() =>
                                                        setOpenDialog(true)
                                                    }
                                                >
                                                    <CirclePlus />
                                                </Button>
                                                <NewCustomListDialog
                                                    openDialog={openDialog}
                                                    setOpenDialog={
                                                        setOpenDialog
                                                    }
                                                    updateCustomList={async () =>
                                                        setCustomLists(
                                                            await getUserLists()
                                                        )
                                                    }
                                                />
                                            </CommandItem>
                                        )}
                                    {customLists &&
                                        (customLists?.data as string[])?.map(
                                            (entry) => (
                                                <CommandItem
                                                    key={`item-${entry}`}
                                                    value={entry}
                                                >
                                                    <span>{entry}</span>
                                                    <Button
                                                        variant='ghost'
                                                        className='p-0! hover:cursor-pointer'
                                                        tabIndex={-1}
                                                        onClick={
                                                            listClickHandler
                                                        }
                                                        data-listname={entry}
                                                    >
                                                        {renderIcon(entry)}
                                                    </Button>
                                                </CommandItem>
                                            )
                                        )}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </>
    );
}
