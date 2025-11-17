import PropTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'

const ConfirmationModal = (props) => {
    const { show, message, onConfirm, onCancel } = props

    if(!show) return null

    return (
        <>
            <Modal
                show={show}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>
                        No
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

ConfirmationModal.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
}

export default ConfirmationModal
