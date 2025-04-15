import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/lib/definitions';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('Failed to verify session', error);
    }
}

export async function createSession(
    userName: string,
    token: string | undefined
) {
    console.log(
        `createSession called with username : ${userName} and token ${token}`
    );
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // basically valid upto 3 hours from now
    if (token === undefined) {
        console.error('token cannot be null not creating session');
        return;
    }
    const session = await encrypt({ userName, expiresAt, token });
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
