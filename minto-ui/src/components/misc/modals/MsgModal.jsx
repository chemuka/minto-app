import { Button, Modal } from "react-bootstrap"
import PropTypes from 'prop-types'

const MsgModal = (props) => {
    const { title, message, show, handleClose } = props

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

MsgModal.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    show: PropTypes.bool,
    handleClose: PropTypes.func,
}

export default MsgModal
