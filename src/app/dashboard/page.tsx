import { Separator } from '@/components/ui/separator';

export default function Page() {
    return (
        <div className='flex'>
            <div>User Area</div>
            <Separator
                orientation='vertical'
                decorative
                style={{ margin: '0 15px' }}
            />
            <div>cards</div>
        </div>
    );
}
