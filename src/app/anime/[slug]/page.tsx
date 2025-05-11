import Anime from '@/components/anime/anime';
import { headers } from 'next/headers';

export default async function Page() {
    const headerList = await headers();
    const currentPathName = headerList.get('x-current-path');
    const slug = currentPathName?.split('/')[2];
    return <Anime slug={slug} />;
}
