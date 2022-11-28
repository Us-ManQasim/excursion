export interface IUser {
    id: String,
    email: string,
}

export interface ISignInResponse {
    token: string
}

export interface ISignUpResponse {
    name: string;
    email: string;
    password: string;
    userRole: string;
    updatedAt: string;
    createdAt: string;
    token: string;
}

export interface IDecodedPayload {
    id: string
    sub: string
    iat: number
    exp: number
}
