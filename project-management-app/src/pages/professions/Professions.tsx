import {useEffect, useState} from "react";
import {SquarePen, Tags, Trash2, X} from "lucide-react";
import Modal from "react-modal";
import {ConfirmPopup} from "@/context/ConfirmPopup";
import {ProfessionType} from "@/types/ProfessionType";
import {deleteProfession, getProfession, getProfessions} from "@/api/profession.api";
import {ProfessionsForm} from "@/pages/professions/ProfessionsForm";

const Professions = () => {

    const [professions, setProfessions] = useState<ProfessionType[] | []>([])
    const [deleteId, setDeleteId] = useState<number>(0)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [editProfession, setEditProfession] = useState<ProfessionType | null>(null)

    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
    }

    const closeModal = () => {
        setIsOpen(false);
        setEditProfession(null);
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

        const fetchProfessions = async () => {
            try {
                const professions: ProfessionType[] = await getProfessions();
                setProfessions(professions);
            } catch (e) {
                if (e instanceof Error) console.error(e.message)
            }
        }
        fetchProfessions()

    }, [])


    const getProfessionsHandle = async () => {

        try {
            const professions: ProfessionType[] = await getProfessions()
            setProfessions(professions)

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

            await deleteProfession(deleteId)
            setDeleteId(0)
            setShowPopup(false);
            const professions = await getProfessions();
            setProfessions(professions)

        }
    };


    const editProfessionsFn = async (id: number) => {

        const profession: ProfessionType = await getProfession(id)
        setEditProfession(profession)
        setIsOpen(true);

    }

    return (<>
            <div className={"page-header mb-20"}>
                <h1>Professions Page</h1>

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
                    {professions && professions.map(profession => (
                        <tr key={profession.id}>
                            <td>{profession.id}</td>
                            <td>{profession.name}</td>
                            <td className="actions">

                                <SquarePen size={24} className={'edit-element'}
                                           onClick={() => editProfessionsFn(profession.id)}/>
                                <Trash2 size={24} className={'delete-element'}
                                        onClick={() => handleDelete(profession.id)}/>

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

                <ProfessionsForm closeModal={() => closeModal()} getMembers={() => getProfessionsHandle()}
                                 professionData={editProfession}/>

            </Modal>
        </>
    );
};

export default Professions;