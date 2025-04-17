'use client';
import { isLoggedIn } from '@/lib/actions';
import { addToLikes, checkIfLiked, removeFromLikes } from '@/lib/anime-apis';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Like() {
    const [isLiked, setIsLiked] = useState(false);
    const [authState, setAuthState] = useState(false);
    const pathname: string = usePathname();
    const slug: string = pathname.split('/')[2];

    useEffect(() => {
        const getIsLiked = async () => {
            setIsLiked(await checkIfLiked(slug));
        };
        const updateAuthState = async () => {
            setAuthState(await isLoggedIn());
        };
        updateAuthState();
        getIsLiked();
    });
    const likeClickHandler = async () => {
        if (!isLiked) setIsLiked(await addToLikes(slug));
        else setIsLiked(!(await removeFromLikes(slug)));
    };

    return (
        <>
            {authState && !isLiked && (
                <Heart
                    className='ml-5 hover:cursor-pointer self-center'
                    onClick={likeClickHandler}
                    size={40}
                />
            )}
            {authState && isLiked && (
                <Heart
                    className='ml-5 hover:cursor-pointer self-center'
                    onClick={likeClickHandler}
                    size={40}
                    fill='#db5151'
                    strokeWidth={0}
                />
            )}
        </>
    );
}
