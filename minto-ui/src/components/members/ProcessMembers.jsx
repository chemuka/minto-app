import { useState } from "react"
import MsgModal from "../misc/modals/MsgModal"
import useConfirmation from "../hooks/useConfirmation"
import ConfirmationModal from "../misc/modals/ConfirmationModal"

const ProcessMembers = () => {
    const { show, confirmMsg, showConfirmation, handleConfirm, handleCancel } = useConfirmation()
    const [showModal, setShowModal] =  useState(false)

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleDelete = async () => {
        const confirmed = await showConfirmation('Are you sure you want to delete this item?')
        if(confirmed) {
            console.log('Item deleted!')
        } else {
            console.log('Deletion cancelled.')
        }
    }

    return (
        <>
            <div className="card my-3 border border-danger shadow-lg">
                <div className="card-header bg-danger">
                    <h4 className="card-title text-white">Process Members</h4>
                </div>
                <div className="card-body">
                    <p className="fw-bold fs-3 mt-4 mx-auto">&apos;TODO&apos;</p>
                    <h4>Testing Components</h4>
                    <button 
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleOpenModal}
                    >
                        Show MsgModal
                    </button>
                    <MsgModal 
                        title={'Test Message'} 
                        message={'This is a message modal example for displaying information!'} 
                        show={showModal}
                        handleClose={handleCloseModal}
                    />

                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={handleDelete}
                    >
                        Delete Item
                    </button>
                    <ConfirmationModal
                        show={show}
                        message={confirmMsg}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
                <div className="card-footer">
                    <p>TODO</p>
                </div>
            </div>
        </>
    )
}

export default ProcessMembers
