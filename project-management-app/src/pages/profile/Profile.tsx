import {useEffect, useState} from "react";
import {addMemberAvatar, getMeRequest} from "@/api/auth.api";
import {User} from "@/types/User";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {updateProfileRequest} from "@/api/members.api";
import {getProfessions} from "@/api/profession.api";
import {ProfessionType} from "@/types/ProfessionType";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {SkillType} from "@/types/SkillType";
import {getSkills} from "@/api/skills.api";
import {Camera, CircleCheck} from "lucide-react";
import {Gender} from "@/enums/Gender";
import {capitalize} from "@/helpers/text.helper";


const Profile = () => {

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const [professions, setProfessions] = useState<ProfessionType[]>([]);
    const [skills, setSkills] = useState<SkillType[] | []>([]);

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState(false);


    const [userSkills, setUserSkills] = useState<number[]>([]);

    useEffect(() => {

        (async () => {
            try {


                const professions = await getProfessions();
                setProfessions(professions)

                const skills = await getSkills();
                setSkills(skills)

                const user = await getMeRequest()
                setUser(user)

                if (user?.skills && user?.skills.length) {
                    setUserSkills(user?.skills)
                }
                setLoading(false)
            } catch (err) {

                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || "");
                } else if (err instanceof Error) {
                    setError(err.message || "");
                }

            }
        })()

    }, [setUser])

    const userProfileSchema = Yup.object({
        name: Yup.string().required("Required"),
        phone: Yup.string().required("Required"),
        professionId: Yup.number().required("Profession ID is required").test(
            "Profession is required",
            (value) => value !== 0
        ),
        gender: Yup.mixed<Gender>()
            .oneOf(Object.values(Gender), "Invalid gender")
            .required("Gender is required"),
    });

    type ProfileFormValues = {
        phone: string;
        name: string;
        gender: Gender;
        professionId: number;
    };


    const handleLoginSubmit = async (values: ProfileFormValues) => {

        setError("");
        setSubmitting(true);

        const name = values.name;
        const phone = values.phone;
        const gender = values.gender;
        const professionId: number = Number(values.professionId);
        const skills = userSkills;

        try {

            const data = await updateProfileRequest({name, phone, professionId, skills, gender});

            if ("error" in data) {
                setError(data.error)
            } else {
                setError(null);
                setSuccess("Profile successfully updated");
                setTimeout(() => {
                    setSuccess(null)
                }, 2000)
            }
            setSubmitting(false);

        } catch (err) {

            console.error(err);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Login failed");
            }
        }
    };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed");
            return;
        }

        const mb = 2;
        // Validate file size (max 1MB)
        if (file.size > mb * 1024 * 1024) {
            setError(`File size must be ${mb}MB or less`);
            return;
        }

        // Upload immediately
        const formData = new FormData();
        formData.append("avatar", file);

        try {

            await addMemberAvatar(formData)

            const user = await getMeRequest()
            setUser(user)

        } catch (err) {

            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Login failed");
            } else {
                setError("Upload failed");
            }
        }
    };


    if (loading) {
        return <PageInnerLoader/>
    }

    return (<>


            <div className={"page-header mb-20"}>
                <h1>Profile</h1>
            </div>


            {error && error.length &&
                <Alerts text={error} type={AlertEnums.danger} cb={() => {
                    setError(null)
                }}/>
            }

            {success && success.length &&
                <Alerts text={success} type={AlertEnums.success} cb={() => {
                    setSuccess(null)
                }}/>
            }

            <div className="profile-container">


                <div className={"input-row"}>
                    <label htmlFor="name">Your role</label>
                    <input type="text" disabled={true} value={user?.user?.role}/>
                </div>

                <label className="user-avatar" form="avatar-img">

                    <img
                        src={user?.user.avatar ? apiUrl + user.user.avatar : (`/src/assets/avatars/${user?.user.gender}.png`)}/>
                    <Camera size={82} className="change-avatar"/>

                    <input type="file" name="avatar-img" id="avatar-img" style={{display: "none"}}
                           onChange={handleFileChange}/>

                </label>


                <Formik
                    initialValues={{
                        name: user?.user?.name || "",
                        phone: user?.user?.phone || "",
                        gender: user?.user?.gender as Gender || Gender.MALE,
                        professionId: user?.user?.professionId || 0
                    }}
                    validationSchema={userProfileSchema}
                    onSubmit={handleLoginSubmit}
                >

                    {() => (
                        <Form>

                            <div className="input-row-2">
                                <div className={"input-row"}>
                                    <label htmlFor="email">Gender *</label>
                                    <Field as="select" name="gender" id="gender">

                                        <option value={Gender.MALE}
                                                key={Gender.MALE}>{capitalize(Gender.MALE)}</option>
                                        <option value={Gender.FEMALE}
                                                key={Gender.FEMALE}>{capitalize(Gender.FEMALE)}</option>
                                        <option value={Gender.UNKNOWN}
                                                key={Gender.UNKNOWN}>{capitalize(Gender.UNKNOWN)}</option>


                                    </Field>
                                </div>

                                <div className={"input-row"}>
                                    <div className={"input-row"}>
                                        <label htmlFor="phone">Profession</label>
                                        <Field as="select" name="professionId" id="professionId">
                                            <option value={0} key={0}>Select profession</option>
                                            {professions.map((profession: ProfessionType) => (
                                                <option value={profession.id}
                                                        key={profession.id}>{profession.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="professionId" component="div" className="error-msg"/>
                                    </div>
                                </div>
                            </div>

                            <div className="input-row-2">
                                <div className={"input-row"}>
                                    <label htmlFor="name">Name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                    />
                                    <ErrorMessage name="name" component="div" className="error-msg"/>
                                </div>


                                <div className={"input-row"}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        placeholder="Phone"
                                    />
                                    <ErrorMessage name="phone" component="div" className="error-msg"/>
                                </div>
                            </div>

                            <div className="profile-skills-list">

                                {skills && skills.map(skill => (
                                    <div className={"skill-item " + (userSkills.includes(skill.id) ? 'active' : '')}
                                         key={skill.id}
                                         onClick={() => {
                                             setUserSkills(prevState => {
                                                 // Check if the skill is already in the array
                                                 if (prevState.includes(skill.id)) {
                                                     return prevState.filter(id => id !== skill.id);
                                                 } else {
                                                     return [...prevState, skill.id];
                                                 }
                                             });

                                         }}>
                                        <span>{skill.name}</span>
                                        <CircleCheck size={14}/>
                                    </div>
                                ))}

                            </div>


                            <div className={"input-row"}>
                                <button className={'btn primary'} type="submit" disabled={submitting}>Save changes
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default Profile;