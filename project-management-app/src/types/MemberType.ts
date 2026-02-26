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