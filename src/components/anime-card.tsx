import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Anime } from '@/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import RemoveFromCustomListButton from './anime/RemoveFromCustomListButton';

interface CardProps {
    readonly anime: Anime;
    readonly index: number;
    readonly includeRemoveIcon?: boolean;
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
            <CardFooter className='flex justify-between'>
                <CardTitle>
                    {props.index + 1}. {anime.name}
                </CardTitle>
                {props.includeRemoveIcon && (
                    <RemoveFromCustomListButton slug={anime.slug} />
                )}
            </CardFooter>
        </Card>
    );
}
