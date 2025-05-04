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
import { getUserLists } from '@/lib/user-apis';

export function AniSagaSidebar() {
    const auth = useContext(AuthContext);
    const [user, setUser] = useState<DisplayUser>();
    const [userLists, setUserLists] = useState<string[]>();

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
        const updateUserLists = async () => {
            const resp = await getUserLists();
            const lists = resp.data as string[];
            setUserLists(lists);
        };
        updateUser();
        updateAuthState();
        updateUserLists();
    }, [auth]);
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
                {userLists && userLists.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>User Lists</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {userLists.map((entry) => (
                                    <SidebarMenuItem key={`user-list-${entry}`}>
                                        <SidebarMenuButton>
                                            <Link href={`/user-list/${entry}`}>
                                                <span>{entry}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                {auth.authState && user && <NavUser user={user} />}
            </SidebarFooter>
        </Sidebar>
    );
}
