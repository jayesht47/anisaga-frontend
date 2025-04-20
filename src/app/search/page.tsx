'use client';
import { SearchResultTable } from '@/components/search-results-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchAnimeByName } from '@/lib/anime-apis';
import { Anime } from '@/lib/definitions';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [animeList, setAnimeList] = useState<[Anime]>();
    const [errorMsg, setErrorMsg] = useState<string>();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const searchClickHanlder = async () => {
        setAnimeList(undefined);
        setErrorMsg('');
        const searchText = (
            document.getElementById('search-text') as HTMLInputElement
        ).value;
        await searchAnime(searchText);
    };

    const searchAnime = async (searchtext: string | null) => {
        if (!searchtext || searchtext.length < 3) {
            setErrorMsg('The Search query should be atleast 3 characters long');
            return;
        }
        if (searchtext) {
            const result = await searchAnimeByName(searchtext);
            if (result) {
                const newSearchQuery = new URLSearchParams();
                newSearchQuery.set('searchText', searchtext);
                setAnimeList(result);
                router.push(`${pathName}?${newSearchQuery.toString()}`);
            } else {
                setErrorMsg('Internal Server Error occurred.');
            }
        }
    };

    useEffect(() => {
        const searchText = searchParams.get('searchText');
        const searchField = document.getElementById(
            'search-text'
        ) as HTMLInputElement;
        if (searchText) {
            searchField.value = searchText;
            searchAnime(searchText);
        }
    }, []);

    return (
        <div className='w-full flex content-center'>
            <div className='w-full'>
                <header className='text-center font-semibold text-3xl mt-10'>
                    Search AniSaga
                </header>
                <div className='flex justify-center mt-10'>
                    <Input
                        type='text'
                        id='search-text'
                        className='max-w-sm self-center '
                    />
                    <Button
                        variant={'default'}
                        className='mx-2  hover:cursor-pointer'
                        onClick={searchClickHanlder}
                    >
                        <SearchIcon />
                        Search
                    </Button>
                </div>
                <div className='w-full flex justify-center'>
                    {errorMsg && (
                        <span className='text-red-400 font-semibold text-center my-2'>
                            {errorMsg}
                        </span>
                    )}
                </div>
                <div className='m-10'>
                    {animeList && <SearchResultTable animeList={animeList} />}
                </div>
            </div>
        </div>
    );
}
