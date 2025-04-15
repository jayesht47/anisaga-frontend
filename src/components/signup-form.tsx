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
import { signup } from '@/lib/actions';
import { useActionState } from 'react';

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const [state, action] = useActionState(signup, undefined);

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Sign up</CardTitle>
                    <CardDescription>
                        Enter userName and password to sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-2'>
                                <Label htmlFor='userName'>username</Label>
                                <Input
                                    id='userName'
                                    type='text'
                                    placeholder='enter username'
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
                                {state?.message && (
                                    <p className='text-red-400'>
                                        {state.message}
                                    </p>
                                )}
                            </div>
                            <Button type='submit' className='w-full'>
                                Sign up
                            </Button>
                        </div>
                        <div className='mt-4 text-center text-sm'>
                            Already have an account?{' '}
                            <Link
                                href={'/login'}
                                className='underline underline-offset-4'
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
