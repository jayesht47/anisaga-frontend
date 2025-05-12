'use client';
import AnimeCard from '@/components/anime-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCustomList } from '@/lib/anime-apis';
import { Anime } from '@/lib/definitions';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [animeList, setAnimeList] = useState<Anime[]>();
    const [error, setError] = useState(false);
    const currentPathName = usePathname();
    const listName = currentPathName?.split('/')[2] as string;

    useEffect(() => {
        const updateAnimeList = async () => {
            const response = await getCustomList(listName);
            if (response.error === 'true') {
                setError(true);
            } else setAnimeList(response.data as Anime[]);
        };
        updateAnimeList();
    }, [listName]);

    return (
        <div className='flex-row'>
            <h1 className='text-3xl flex justify-center mb-5'>{listName}</h1>
            <div className='flex flex-wrap justify-center'>
                {!animeList && <Skeleton className='h-130 w-5xl mx-4' />}
                {animeList &&
                    animeList?.map((item, index) => (
                        <AnimeCard
                            anime={item}
                            index={index}
                            key={`card-${index}`}
                            includeRemoveIcon={true}
                        />
                    ))}
                {error && (
                    <p className='text-3xl text-red-400'>
                        Internal Server Error
                    </p>
                )}
                {animeList && animeList.length === 0 && (
                    <p className='text-3xl text-red-400'>Empty list!</p>
                )}
            </div>
        </div>
    );
}
