import { Anime } from '@/lib/definitions';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultProps {
    readonly animeList: [Anime];
}

export function SearchResultTable(props: SearchResultProps) {
    return (
        <div>
            <Table>
                <TableBody>
                    {props.animeList.map((anime) => (
                        <TableRow key={anime.slug}>
                            <TableCell>
                                <Image
                                    height={100}
                                    width={70}
                                    src={anime.images.largePosterImage}
                                    alt={`poster image for ${anime.slug}`}
                                    className='m-auto'
                                />
                            </TableCell>
                            <TableCell>
                                <div>
                                    <Link href={`/anime/${anime.slug}`}>
                                        <h3 className='font-semibold text-lg'>
                                            {anime.name}
                                        </h3>
                                    </Link>
                                </div>
                                <div className='font-thin'>
                                    Released{' '}
                                    <span>
                                        {anime?.startDate?.substring(0, 4)}
                                    </span>
                                    <br />
                                    Average Rating :{' '}
                                    <span>{anime.averageRating}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
