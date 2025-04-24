'use server';

import { cookies } from 'next/headers';
import {
    AnimeAPIResponse,
    FormSchema,
    FormState,
    SessionPayload,
} from './definitions';
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
            let sessionPayload: SessionPayload;
            if (session?.sub) {
                sessionPayload = JSON.parse(session?.sub);
                return sessionPayload.userName;
            } else throw new Error(' failed to decrypt session!');
        } else return undefined;
    } catch (e) {
        console.error(`Exception occurred in getUserName : ${e}`);
        return undefined;
    }
};

export const updateRecommendations = async () => {
    const hostname: string | undefined = process.env.SERVER_URL;
    console.log(`process.env.SERVER_URL is ${process.env.SERVER_URL}`);
    if (hostname == undefined) throw new Error('server url not configured!');
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    let respObj: AnimeAPIResponse;
    try {
        const cookie = (await cookies()).get('session')?.value;
        let sessionPayload: SessionPayload;
        const session = await decrypt(cookie);
        if (session?.sub) {
            sessionPayload = JSON.parse(session.sub);
        } else {
            throw new Error('failed to decrypt session');
        }
        const userName = sessionPayload.userName;
        headers.set('Authorization', `Bearer ${sessionPayload.token}`);
        console.log(`token is ${sessionPayload.token}`);
        const reqBody = {
            userName: userName,
            regenRecommendations: true,
        };
        console.log(`reqBody is ${JSON.stringify(reqBody)}`);
        const recommendationsUrl = hostname
            ? hostname + `/users/user/${userName}/recommendations`
            : '';
        console.info(`recommendationsUrl is ${recommendationsUrl}`);
        const response = await fetch(recommendationsUrl, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: headers,
        });
        const apiResponse = await response.json();
        respObj = {
            data: apiResponse, // Assign the actual API response to respObj.data
            error: response.ok ? 'false' : 'true',
            status: response.status,
        };
        if (response.status != 200) {
            console.error(
                `receieved status ${response.status} getUserRecommendations for ${userName} `
            );
        }
        return respObj;
    } catch (error) {
        console.error('Error occurred in getUserRecommendations', error);
        respObj = {
            data: [],
            error: 'true',
            status: 500,
        };
        return respObj;
    }
};
