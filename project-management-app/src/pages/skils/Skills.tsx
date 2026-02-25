import {useEffect, useState} from "react";
import {SkillType} from "@/types/SkillType";
import {SquarePen, Tags, Trash2, X} from "lucide-react";
import Modal from "react-modal";
import {deleteSkill, getSkills} from "@/api/skills.api";
import {SkillForm} from "@/context/SkillForm";
import {ConfirmPopup} from "@/context/ConfirmPopup";

const Skills = () => {

    const [skills, setSkills] = useState<SkillType[] | []>([])
    const [deleteId, setDeleteId] = useState<number>(0)
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.

    }


    const closeModal = () => {
        setIsOpen(false);

    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    useEffect(() => {

        const fetchSkills = async () => {
            try {
                const skills = await getSkills();
                setSkills(skills)
            } catch (e) {
                if (e instanceof Error) console.error(e.message)
            }
        }
        fetchSkills()

    }, [setSkills])


    const getSkillsHandle = async () => {

        try {
            const skills: SkillType[] = await getSkills()
            setSkills(skills)

        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message) // safe access
            } else {
                console.error(e) // fallback for non-Error thrown values
            }
        }
    }
    const handleDelete = (id: number) => {
        setDeleteId(id)
        setShowPopup(true)

    };


    const [showPopup, setShowPopup] = useState(false);
    const cancelDelete = () => {
        setShowPopup(false)
        setDeleteId(0)
    }
    const confirmDelete = async () => {



        if (deleteId > 0) {

            await deleteSkill(deleteId)
            setDeleteId(0)
            setShowPopup(false);
            const skills = await getSkills();
            setSkills(skills)

        }


    };

    return (<>
            <div className={"page-header mb-20"}>
                <h1>Skills Page</h1>

                <button className={"btn ml-auto"} onClick={() => {
                    openModal()
                }}>
                    <span>Add new</span>
                    <Tags size={16}/>
                </button>
            </div>

            <div className="items-list">
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>ID:</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills && skills.map(skill => (
                        <tr key={skill.id}>
                            <td>{skill.id}</td>
                            <td>{skill.name}</td>
                            <td className="actions">

                                <SquarePen size={24} className={'edit-element'}/>
                                <Trash2 size={24} className={'delete-element'} onClick={() => handleDelete(skill.id)}/>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            {showPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this item?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >


                <X onClick={closeModal} className="close-modal"/>

                <SkillForm closeModal={() => closeModal()} getMembers={() => getSkillsHandle()}/>

            </Modal>
        </>
    );
};

export default Skills;