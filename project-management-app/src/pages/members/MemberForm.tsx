import {useEffect, useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {addMember} from "@/api/members.api";
import {AxiosError} from "axios";
import {ProfessionType} from "@/types/ProfessionType";
import {getProfessions} from "@/api/profession.api";
import {Gender} from "@/enums/Gender";
import {capitalize} from "@/helpers/text.helper";

export const MemberForm = ({closeModal, getMembers}: { closeModal: () => void, getMembers: () => void }) => {


    const [error, setError] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const memberSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().required("Phone is required"),
        name: Yup.string().required("Name is required"),
        gender: Yup.mixed<Gender>()
            .oneOf(Object.values(Gender), "Invalid gender")
            .required("Gender is required"),
        professionId: Yup.number().required("Profession ID is required").test(
            "Profession is required",
            (value) => value !== 0
        )
    });

    type MemberFormValues = {
        email: string;
        phone: string;
        name: string;
        gender: Gender;
        professionId: number;
    };


    const [professions, setProfessions] = useState<ProfessionType[]>([]);

    useEffect(() => {
        (async () => {
            const professions = await getProfessions();
            setProfessions(professions)
        })()
    }, [setProfessions])

    const handleSubmit = async (values: MemberFormValues) => {

        setSubmitting(true);
        setError("");

        const payload = {...values, professionId: Number(values.professionId)};

        try {

            const data = await addMember(payload);


            if ("error" in data) {
                setError(data.error)
            } else {

                closeModal()
                getMembers()
            }
            setSubmitting(false);

        } catch (err) {

            console.log("error", err);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Add member failed");
            }
        }

    }

    return (
        <div className="member-form">
            <div className="error-msg">{error}</div>
            <Formik
                initialValues={{
                    email: "",
                    phone: "",
                    name: "",
                    gender: Gender.MALE,
                    professionId: professions[0]?.id || 0
                }}
                validationSchema={memberSchema}
                onSubmit={handleSubmit}
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
                            <label htmlFor="email">Email</label>
                            <Field
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                            />
                            <ErrorMessage name="email" component="div" className="error-msg"/>
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
                            <label htmlFor="gender">Gender *</label>
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
                                    <option value={0}>Select profession</option>
                                    {professions.map((profession: ProfessionType) => (
                                        <option value={profession.id}>{profession.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="professionId" component="div" className="error-msg"/>
                            </div>
                        </div>

                        <div className={"input-row"}>
                            <button className={'btn primary'} type="submit" disabled={submitting}>Add member</button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    )

}