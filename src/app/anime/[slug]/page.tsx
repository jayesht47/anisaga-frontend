'use client';
import CustomList from '@/components/anime/CustomList';
import Like from '@/components/anime/like';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnimeBySlug } from '@/lib/anime-apis';
import { Anime } from '@/lib/definitions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const pathName = usePathname();
    const slug = pathName.split('/')[2];
    const [anime, setAnime] = useState<Anime>();
    const orignalPosterImageSrc: string =
        anime?.images.originalPosterImage === undefined
            ? ''
            : anime?.images.originalPosterImage;
    useEffect(() => {
        const getAnime = async () => {
            setAnime(await getAnimeBySlug(slug));
        };
        getAnime();
    }, [slug]);
    return (
        <div className='flex flex-col justify-start lg:flex-row lg:mt-10'>
            {anime && (
                <div className='flex justify-center w-full lg:size-min lg:w-1/3 lg:mx-10'>
                    <Card>
                        <CardContent>
                            <Image
                                src={orignalPosterImageSrc}
                                alt={`poster image for ${anime?.name}`}
                                height={400}
                                width={350}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
            {!anime && (
                <Skeleton className='h-[500px] w-9/10 self-center lg:w-1/3 lg:mx-10' />
            )}
            <div className='flex-row lg:w-2/3 lg:me-20'>
                {anime && (
                    <div className='text-3xl justify-between mx-5 my-2 flex lg:text-5xl lg:mx-0 '>
                        <div>{anime?.name}</div>
                        <div className='flex'>
                            <Like />
                            <CustomList />
                        </div>
                    </div>
                )}
                {!anime && (
                    <Skeleton className='h-20 w-9/10 self-center mx-auto mt-5 lg:w-full ' />
                )}
                <div className='my-2'>
                    <span className='text-xl font-bold ml-5 lg:ml-0'>
                        Synopsis
                    </span>
                    <Separator className='my-2' />
                    <div className='mx-5 lg:mx-0'>{anime?.synopsis}</div>
                </div>
                <hr className='my-1'></hr>
                {anime?.genres?.length !== undefined &&
                    anime?.genres?.length > 0 && (
                        <div className='flex my-2'>
                            <div className='font-bold'>Genres : </div>
                            {anime?.genres?.map((genre, index) => {
                                return (
                                    <div
                                        className='self-center	mx-1'
                                        key={genre}
                                    >
                                        {anime.genres?.length !== index + 1 &&
                                            genre + ','}
                                        {anime.genres?.length === index + 1 &&
                                            genre}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                <div className='flex my-2 '>
                    <div className='font-bold'>Number of Episodes :</div>
                    <div className='mx-1 self-center'>
                        {anime?.episodeCount}
                    </div>
                </div>
                <div className='flex my-2 '>
                    <div className='font-bold'>Trailer : </div>
                    <a
                        href={
                            'https://www.youtube.com/watch?v=' +
                            anime?.youtubeVideoId
                        }
                        className='mx-1 text-sky-400 self-center'
                        target='_blank'
                    >
                        Youtube
                    </a>
                </div>
            </div>
        </div>
    );
}
