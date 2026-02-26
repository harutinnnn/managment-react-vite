export type User = {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        phone: string;
        avatar: string,
        gender: 'male' | 'female' | 'unknown';
        professionId: number
    },
    skills: number[],
};
