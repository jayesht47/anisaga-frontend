import 'server-only';
import { AuthResponse, User } from './definitions';

export const registerUser = async (user: User) => {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error('server url not configured!');
    const registerUrl = hostname ? hostname + '/auth/register' : '';
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const response = await fetch(registerUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: headers,
    });
    const respObj: AuthResponse = await response.json();
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
};

export const loginUser = async (user: User) => {
    const hostname: string | undefined = process.env.SERVER_URL;
    console.log(`process.env.SERVER_URL is ${process.env.SERVER_URL}`);
    if (hostname == undefined) throw new Error('server url not configured!');
    const loginUrl = hostname ? hostname + '/auth/login' : '';
    console.info(`loginUrl is ${loginUrl}`);
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const response = await fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: headers,
    });
    const respObj = await response.json();
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
};
