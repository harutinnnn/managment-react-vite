export type MemberType = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    gender: 'male' | 'female' | 'unknown';
    avatar: string;
}