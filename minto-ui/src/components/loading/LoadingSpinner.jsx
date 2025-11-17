import { Spinner } from "react-bootstrap"
import PropTypes from 'prop-types'

const LoadingSpinner = (props) => {
    const { caption, clsTextColor } = props

    return (
        <>
            <div className="container mt-5 pt-4">
                <h3 className={clsTextColor}>Loading {caption}...</h3>
                <div className={`d-flex justify-content-center align-items-center ${clsTextColor}`} style={{ height: '30vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </div>
        </>
    )
}

LoadingSpinner.propTypes = {
    caption: PropTypes.string,
    clsTextColor: PropTypes.string,
}

export default LoadingSpinner
