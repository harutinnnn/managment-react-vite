import { useState } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AxiosError } from "axios";
import { addSkill, editSkill as updateSkillApi } from "@/api/skills.api"; // Renamed to avoid confusion
import { SkillType } from "@/types/SkillType";

interface SkillFormProps {
    closeModal: () => void;
    getMembers: () => void;
    skillData: SkillType | null;
}

interface MemberFormValues {
    name: string;
}

export const SkillForm = ({ closeModal, getMembers, skillData }: SkillFormProps) => {
    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        name: Yup.string().required("Name is required"),
    });

    const handleSubmit = async (values: MemberFormValues) => {
        setError("");
        try {
            if (skillData) {

                // Logic for Editing
                const result = await updateSkillApi({
                    id: skillData.id,
                    name: values.name,
                });

                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getMembers();
                }
            } else {
                // Logic for Adding
                const result = await addSkill({ name: values.name });
                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getMembers();
                }
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Operation failed");
            }
        }
    };

    return (
        <div className="member-form">
            <div className="error-msg">{error}</div>
            <Formik
                // KEY FIX #1: Tell Formik to watch for prop changes
                enableReinitialize={true}
                // KEY FIX #2: Ensure we are using skillData?.name correctly
                initialValues={{ name: skillData?.name || "" }}
                validationSchema={memberSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className={"input-row"}>
                            <label htmlFor="name">Name</label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name"
                            />
                            <ErrorMessage name="name" component="div" className="error-msg" />
                        </div>

                        <div className={"input-row"}>
                            <button
                                className={'btn primary'}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {skillData ? "Update Skill" : "Add Skill"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};