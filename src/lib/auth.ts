export interface UserPayload {
    userId: string;
    name: string;
    phone: string;
    email?: string;
    iat: number;
    exp: number;
}
