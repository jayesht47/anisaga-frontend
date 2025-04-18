'use server';

import { cookies } from 'next/headers';
import { FormSchema, FormState } from './definitions';
import { createSession, decrypt, deleteSession } from './session-management';
import { registerUser, loginUser } from './user-apis';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {
    console.log(`formData.get('userName') is ${formData.get('userName')}`);
    const validatedFields = FormSchema.safeParse({
        userName: formData.get('userName'),
        password: formData.get('password'),
    });
    console.log(`validatedFields.success is ${validatedFields.success}`);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    console.info('validaion sucess calling API');
    const respObj = await registerUser(validatedFields.data);
    if (respObj?.status !== 200)
        return {
            message: respObj?.message,
        };
    if (respObj?.token === undefined) {
        console.error('token cannot be null not creating session');
        return;
    }
    await createSession(validatedFields.data.userName, respObj?.token);
    redirect('/dashboard');
}

export async function login(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        userName: formData.get('userName'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    console.info('validaion sucess calling API');
    const respObj = await loginUser(validatedFields.data);
    if (respObj?.status !== 200)
        return {
            message: respObj?.message,
        };
    if (respObj?.token === undefined) {
        console.error('token cannot be null not creating session');
        return;
    }
    await createSession(validatedFields.data.userName, respObj?.token);
    return {
        message: respObj?.status.toString(),
    };
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}

export const isLoggedIn = async () => {
    try {
        const cookie = (await cookies()).get('session')?.value;
        if (cookie) {
            const session = await decrypt(cookie);
            return !!session;
        } else return false;
    } catch (e) {
        console.error(`Exception occurred in isLoggedIn : ${e}`);
        return false;
    }
};

export const getUserName = async () => {
    try {
        const cookie = (await cookies()).get('session')?.value;
        console.log(`cookie is ${cookie}`);
        if (cookie) {
            const session = await decrypt(cookie);
            return session?.sub;
        } else return undefined;
    } catch (e) {
        console.error(`Exception occurred in getUserName : ${e}`);
        return undefined;
    }
};
