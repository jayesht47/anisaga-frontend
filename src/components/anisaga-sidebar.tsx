'use client';
import { Home, Search, LayoutDashboard, LogInIcon } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { NavUser } from './ui/nav-user';
import { useContext, useEffect, useState } from 'react';
import { getUserName, isLoggedIn } from '@/lib/actions';
import { DisplayUser } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/auth-provider';

export function AniSagaSidebar() {
    const auth = useContext(AuthContext);
    const [user, setUser] = useState<DisplayUser>();

    const router = useRouter();

    const loginClickHandler = () => {
        router.push('/login');
    };

    useEffect(() => {
        const updateUser = async () => {
            setUser({ name: await getUserName(), email: '', avatar: '' });
        };
        const updateAuthState = async () => {
            auth.setAuthState(await isLoggedIn());
        };
        updateUser();
        updateAuthState();
    }, []);
    return (
        <Sidebar collapsible='offcanvas'>
            <SidebarHeader>
                <Link href={'/'}>
                    <span className='text-base font-semibold'>AniSaga</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={'/'}>
                                        <Home />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={'/search'}>
                                        <Search />
                                        <span>Search</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                {auth.authState && (
                                    <SidebarMenuButton asChild>
                                        <Link href={'/dashboard'}>
                                            <LayoutDashboard />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                {!auth.authState && (
                                    <SidebarMenuButton
                                        onClick={loginClickHandler}
                                    >
                                        <LogInIcon />
                                        <span>Login</span>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {auth.authState && user && <NavUser user={user} />}
            </SidebarFooter>
        </Sidebar>
    );
}
