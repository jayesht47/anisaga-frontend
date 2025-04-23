'use server';
import {
    AuthResponse,
    RecommendationResponse,
    SessionPayload,
    User,
} from './definitions';
import { cookies } from 'next/headers';
import { decrypt } from './session-management';

export const registerUser = async (user: User) => {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error('server url not configured!');
    const registerUrl = hostname ? hostname + '/auth/register' : '';
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    let respObj: AuthResponse;
    try {
        const response = await fetch(registerUrl, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: headers,
        });
        respObj = await response.json();
        if (response.status != 200) {
            respObj.status = response.status;
            console.error(
                `receieved status ${response.status} for register user for ${
                    user.userName
                } response json was ${JSON.stringify(respObj)}`
            );
            return respObj;
        }

        if (response.status === 200) {
            respObj.status = response.status;
            console.debug('registration successfull');
            console.info(`response json was ${JSON.stringify(respObj)}`);
            return respObj;
        }
    } catch (error) {
        console.error('Error occurred in registerUser', error);
        respObj = {
            status: 500,
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            token: '',
        };
        return respObj;
    }
};

export const loginUser = async (user: User) => {
    const hostname: string | undefined = process.env.SERVER_URL;
    console.log(`process.env.SERVER_URL is ${process.env.SERVER_URL}`);
    if (hostname == undefined) throw new Error('server url not configured!');
    const loginUrl = hostname ? hostname + '/auth/login' : '';
    console.info(`loginUrl is ${loginUrl}`);
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    let respObj: AuthResponse;
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: headers,
        });
        respObj = await response.json();
        if (response.status != 200) {
            respObj.status = response.status;
            console.error(
                `receieved status ${response.status} for login user for ${
                    user.userName
                } response json was ${JSON.stringify(respObj)}`
            );
            return respObj;
        }

        if (response.status === 200) {
            respObj.status = response.status;
            console.debug('login successfull');
            console.info(`response json was ${JSON.stringify(respObj)}`);
            return respObj;
        }
    } catch (error) {
        console.error('Error occurred in login user', error);
        respObj = {
            status: 500,
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            token: '',
        };
        return respObj;
    }
};

export const getUserRecommendations = async () => {
    const hostname: string | undefined = process.env.SERVER_URL;
    console.log(`process.env.SERVER_URL is ${process.env.SERVER_URL}`);
    if (hostname == undefined) throw new Error('server url not configured!');
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    let respObj: RecommendationResponse;
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
            regenRecommendations: false,
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
