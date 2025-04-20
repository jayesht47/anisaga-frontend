'use client';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getLikedAnimes } from '@/lib/anime-apis';
import { Anime } from '@/lib/definitions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [userLikes, setUserLikes] = useState<[Anime] | undefined>(undefined);
    const router = useRouter();
    useEffect(() => {
        const updateUserLikes = async () => {
            setUserLikes(await getLikedAnimes());
        };
        updateUserLikes();
    }, []);
    return (
        <div className='m-10 flex-col'>
            <div className='text-bold text-4xl'>My Likes</div>
            <Separator className='my-4' />
            <div className='justify-items-start mx-10 w-full'>
                {userLikes && (
                    <Carousel className='w-full max-w-5xl'>
                        <CarouselContent>
                            {userLikes?.map((anime) => (
                                <CarouselItem
                                    key={anime.slug}
                                    className='md:basis-1/2 lg:basis-1/3'
                                >
                                    <Card className='m-3'>
                                        <CardContent className='justify-items-center'>
                                            <Image
                                                src={
                                                    anime.images
                                                        .originalPosterImage
                                                }
                                                alt={anime.slug}
                                                width={200}
                                                height={300}
                                                onClick={() =>
                                                    router.push(
                                                        `/anime/${anime.slug}`
                                                    )
                                                }
                                                className='hover:cursor-pointer'
                                            />
                                        </CardContent>
                                        <CardFooter className='justify-center'>
                                            <CardTitle>{anime.name}</CardTitle>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}
                {!userLikes && <Skeleton className='h-64 w-5xl mx-4' />}
            </div>
        </div>
    );
}
