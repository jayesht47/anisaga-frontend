'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useActionState, useContext, useEffect } from 'react';
import { login } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { AuthContext } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const [state, action, isPending] = useActionState(login, undefined);
    const auth = useContext(AuthContext);
    const router = useRouter();
    useEffect(() => {
        if (!isPending) {
            if (state?.message === '200') {
                auth.setAuthState(true);
                router.push('/dashboard');
            }
        }
    }, [isPending, auth, state, router]);
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-2'>
                                <Label htmlFor='email'>Username</Label>
                                <Input
                                    id='username'
                                    type='text'
                                    placeholder='username'
                                    name='userName'
                                    required
                                />
                                {state?.errors?.userName && (
                                    <p className='text-red-400'>
                                        {state.errors.userName}
                                    </p>
                                )}
                            </div>
                            <div className='grid gap-2'>
                                <div className='flex items-center'>
                                    <Label htmlFor='password'>Password</Label>
                                </div>
                                <Input
                                    id='password'
                                    type='password'
                                    name='password'
                                    required
                                />
                                {state?.errors?.password && (
                                    <p className='text-red-400'>
                                        {state.errors.password}
                                    </p>
                                )}
                                {state?.message && state?.message !== '200' && (
                                    <p className='text-red-400'>
                                        {state.message}
                                    </p>
                                )}
                            </div>
                            {!isPending && (
                                <Button type='submit' className='w-full'>
                                    Login
                                </Button>
                            )}
                            {isPending && (
                                <Button disabled>
                                    <Loader2 className='animate-spin' />
                                    Please wait
                                </Button>
                            )}
                        </div>
                        <div className='mt-4 text-center text-sm'>
                            Don&apos;t have an account?{' '}
                            <Link
                                href={'/signup'}
                                className='underline underline-offset-4'
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
