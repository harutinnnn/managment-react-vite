import {SkillType} from "@/types/SkillType";
import {Statuses} from "@/enums/Statuses";

export type MemberType = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    gender: 'male' | 'female' | 'unknown';
    avatar: string;
    status: Statuses.PENDING | Statuses.PUBLISHED | Statuses.BLOCKED;
}

export type MemberJoinSkillType = {
    user: MemberType;
    skills: SkillType[]
}

export type UserUnreadMessagesType = {

    id: number,
    companyId: number
    professionId: number
    name: string
    email: string
    phone: string
    password: string
    refreshToken: string
    avatar: string
    gender: string
    status: number
    role: string
    unreadMessages: number
}