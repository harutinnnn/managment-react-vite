import {useEffect, useState} from "react";
import {getMeRequest} from "@/api/auth.api";
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

const Profile = () => {

    const [professions, setProfessions] = useState<ProfessionType[]>([]);

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        (async () => {
            try {


                const professions = await getProfessions();
                setProfessions(professions)

                const user = await getMeRequest()
                setUser(user)

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
        )
    });

    type ProfileFormValues = {
        phone: string;
        name: string;
        professionId: number;
    };


    const handleLoginSubmit = async (values: ProfileFormValues) => {

        setError("");
        setSubmitting(true);

        const name = values.name;
        const phone = values.phone;
        const professionId: number = Number(values.professionId);


        try {

            const data = await updateProfileRequest({name, phone, professionId});

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


    if (loading) {
        return <PageInnerLoader/>
    }

    return (<>


            <div className={"page-header mb-20"}>
                <h1>Profile</h1>
            </div>


            {error && error.length &&
                <Alerts text={error} type={AlertEnums.danger}/>
            }

            {success && success.length &&
                <Alerts text={success} type={AlertEnums.success}/>
            }

            <div className="profile-container">


                <div className={"input-row"}>
                    <label htmlFor="name">Your role</label>
                    <input type="text" disabled={true} value={user?.role}/>
                </div>

                <Formik
                    initialValues={{
                        name: user?.name || "",
                        phone: user?.phone || "",
                        professionId: user?.professionId || 0
                    }}
                    validationSchema={userProfileSchema}
                    onSubmit={handleLoginSubmit}
                >

                    {() => (
                        <Form>
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


                            <div className={"input-row"}>
                                <div className={"input-row"}>
                                    <label htmlFor="phone">Profession</label>
                                    <Field as="select" name="professionId" id="professionId">
                                        <option value={0} key={0}>Select profession</option>
                                        {professions.map((profession: ProfessionType) => (
                                            <option value={profession.id} key={profession.id}>{profession.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="professionId" component="div" className="error-msg"/>
                                </div>
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