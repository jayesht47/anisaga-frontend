'use client';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Anime } from '@/lib/definitions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CardProps {
    readonly anime: Anime;
}

export default function AnimeCard(props: CardProps) {
    const anime = props.anime;
    const router = useRouter();
    return (
        <Card className='m-3'>
            <CardContent>
                <Image
                    height={500}
                    width={300}
                    src={anime.images.largePosterImage}
                    alt={`poster image for ${anime.slug}`}
                    onClick={() => router.push(`/anime/${anime.slug}`)}
                    className='hover:cursor-pointer'
                />
            </CardContent>
            <CardFooter>
                <CardTitle>{anime.name}</CardTitle>
            </CardFooter>
        </Card>
    );
}
