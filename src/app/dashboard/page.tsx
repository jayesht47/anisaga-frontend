import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { getLikedAnimes } from '@/lib/anime-apis';
import Image from 'next/image';

export default async function Page() {
    const userLikes = await getLikedAnimes();
    return (
        <div className='m-10 flex-col'>
            <div className='text-bold text-4xl'>My Likes</div>
            <Separator className='my-4' />
            <div className='justify-items-start mx-10 w-full'>
                <Carousel className='w-full max-w-5xl'>
                    <CarouselContent>
                        {userLikes?.map((e) => (
                            <CarouselItem
                                key={e.slug}
                                className='md:basis-1/2 lg:basis-1/3'
                            >
                                <Card className='m-3'>
                                    <CardContent className='justify-items-center'>
                                        <Image
                                            src={e.images.originalPosterImage}
                                            alt={e.slug}
                                            width={200}
                                            height={300}
                                        />
                                    </CardContent>
                                    <CardFooter className='justify-center'>
                                        <CardTitle>{e.name}</CardTitle>
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
