import bcrypt from "bcrypt";

export async function encryptPW(pw: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pw, salt)
}

export async function checkPW(pw: string, hash: string) {
    return await bcrypt.compare(pw, hash);
}

export function backToLogin() {
    return new Response(null, {
        status: 302,
        headers: {
            'location': '/login',
        }
    })
}

export function notFound() {
    return new Response('not found', {
        status: 404,
    })
}
