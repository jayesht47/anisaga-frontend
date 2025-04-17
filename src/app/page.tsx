import AnimeCard from '@/components/anime-card';
import { getTrendingAnimeList } from '@/lib/anime-apis';

export default async function Home() {
    const animeList = await getTrendingAnimeList();
    return (
        <main>
            {
                <div className='flex-row'>
                    <h1 className='text-3xl flex justify-center mb-5'>
                        Currently Trending Anime
                    </h1>
                    <div className='flex flex-wrap justify-center'>
                        {animeList?.map((item, index) => (
                            <AnimeCard anime={item} key={`card-${index}`} />
                        ))}
                        {animeList?.length === 0 && (
                            <p className='text-3xl text-red-400'>
                                Internal Server Error
                            </p>
                        )}
                    </div>
                </div>
            }
        </main>
    );
}
