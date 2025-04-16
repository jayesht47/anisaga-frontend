'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isLoggedIn, logout } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function Header() {
    const router = useRouter();
    const [authState, setAuthState] = useState(false);

    useEffect(() => {
        const updateAuthState = async () => {
            setAuthState(await isLoggedIn());
        };
        updateAuthState();
    });

    const loginClickHandler = () => {
        router.push('/login');
    };

    const DashboardClickHandler = () => {
        router.push('/dashboard');
    };

    const signupClickHandler = () => {
        router.push('/signup');
    };

    const logoutClickHandler = () => {
        logout();
    };

    const logoClickHandler = () => {
        router.push('/');
    };

    // const searchClickHandler = () => {
    //     router.push('/search');
    // };

    return (
        <header>
            <div className='flex justify-between'>
                <div
                    className='justify-self-start m-6 text-5xl select-none hover:cursor-pointer'
                    onClick={logoClickHandler}
                >
                    AniSaga
                </div>
                <div className='justify-self-end flex '>
                    <Button
                        className='m-6 text-2xl'
                        variant='ghost'
                        size='icon'
                    >
                        <Search />
                    </Button>
                    {!authState && (
                        <Button
                            className='m-6 text-2xl'
                            type='button'
                            onClick={signupClickHandler}
                            variant='outline'
                            size='lg'
                        >
                            Sign up
                        </Button>
                    )}
                    {!authState && (
                        <Button
                            className='m-6 text-2xl'
                            type='button'
                            onClick={loginClickHandler}
                            variant='outline'
                            size='lg'
                        >
                            Login
                        </Button>
                    )}
                    {authState && (
                        <Button
                            className='m-6 text-2xl'
                            type='button'
                            onClick={DashboardClickHandler}
                            variant='outline'
                            size='lg'
                        >
                            Dashboard
                        </Button>
                    )}
                    {authState && (
                        <Button
                            className='m-6 text-2xl'
                            type='button'
                            onClick={logoutClickHandler}
                            variant='outline'
                            size='lg'
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
