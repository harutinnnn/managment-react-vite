import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {MemberType} from "@/types/MemberType";
import {getMember} from "@/api/members.api";
import {Loader} from "lucide-react";
import {PageInnerLoader} from "@/components/PageInnerLoder";

const MembersEdit = () => {

    const {id} = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(true);

    const [member, setMember] = useState<MemberType | null>(null);

    useEffect(() => {

        const getMemberFn = async () => {

            const memberTmp: MemberType = await getMember(Number(id))
            setMember(memberTmp)
            setLoading(false)
        }
        getMemberFn()
    })

    if (loading) {
        return <PageInnerLoader/>
    }


    return <h1>{member?.name}</h1>;
};

export default MembersEdit;