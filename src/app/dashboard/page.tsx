'use client';
import { Button } from '@/components/ui/button';
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
import { updateRecommendations } from '@/lib/actions';
import { getLikedAnimes } from '@/lib/anime-apis';
import { Anime, RecommendationResponse } from '@/lib/definitions';
import { getUserRecommendations } from '@/lib/user-apis';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [userLikes, setUserLikes] = useState<[Anime] | undefined>(undefined);
    const [Recommendations, setRecommendations] = useState<
        RecommendationResponse | undefined
    >();
    const router = useRouter();
    useEffect(() => {
        const updateUserLikes = async () => {
            setUserLikes(await getLikedAnimes());
        };
        const populateRecommendations = async () => {
            setRecommendations(await getUserRecommendations());
        };
        updateUserLikes();
        populateRecommendations();
    }, []);

    const refreshRecommendations = async () => {
        setRecommendations(undefined);
        setRecommendations(await updateRecommendations());
    };
    return (
        <div className='mx-5 flex-col'>
            <div className='text-bold text-4xl'>My Likes</div>
            <Separator className='my-1' />
            <div className='justify-items-center mx-10'>
                {userLikes && (
                    <Carousel className='w-full max-w-5xl'>
                        <CarouselContent>
                            {userLikes?.map((anime) => (
                                <CarouselItem
                                    key={anime.slug}
                                    className='md:basis-1/2 lg:basis-1/5'
                                >
                                    <Card className='m-2'>
                                        <CardContent className='justify-items-center'>
                                            <Image
                                                src={
                                                    anime.images
                                                        .originalPosterImage
                                                }
                                                alt={anime.slug}
                                                width={150}
                                                height={225}
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
            <Separator className='my-1' />
            <div className='flex justify-between'>
                <div className='text-semibold text-xl'>
                    Recommendations Based on likes
                </div>
                <Button variant={'outline'} className='hover:cursor-pointer' onClick={refreshRecommendations}>
                    <RefreshCcw />
                </Button>
            </div>
            <div className='justify-items-center mx-10'>
                {Recommendations?.status === 200 && (
                    <Carousel className='w-full max-w-5xl'>
                        <CarouselContent>
                            {Recommendations?.data?.map((anime) => (
                                <CarouselItem
                                    key={anime.slug}
                                    className='md:basis-1/2 lg:basis-1/5'
                                >
                                    <Card className='m-2'>
                                        <CardContent className='justify-items-center'>
                                            <Image
                                                src={
                                                    anime.images
                                                        .originalPosterImage
                                                }
                                                alt={anime.slug}
                                                width={150}
                                                height={225}
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
                {!Recommendations?.status && (
                    <Skeleton className='h-64 w-5xl mx-4' />
                )}
                {Recommendations?.error == 'true' && (
                    <span className='font-semibold text-xl text-red-400'>
                        Internal Server Error
                    </span>
                )}
            </div>
        </div>
    );
}
