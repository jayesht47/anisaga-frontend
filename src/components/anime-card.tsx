import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Anime } from '@/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
    readonly anime: Anime;
    readonly index: number;
}

export default function AnimeCard(props: CardProps) {
    const anime = props.anime;
    // const router = useRouter();
    return (
        <Card className='m-3'>
            <CardContent>
                <Link href={`/anime/${anime.slug}`}>
                    <Image
                        height={500}
                        width={300}
                        src={anime.images.largePosterImage}
                        alt={`poster image for ${anime.slug}`}
                        // onClick={() => router.push(`/anime/${anime.slug}`)}
                        className='hover:cursor-pointer'
                    />
                </Link>
            </CardContent>
            <CardFooter>
                <CardTitle>
                    {props.index + 1}. {anime.name}
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
