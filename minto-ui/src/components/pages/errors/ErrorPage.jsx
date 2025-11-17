import PropTypes from 'prop-types';

const ErrorPage = ({ status, message }) => {
    return (
        <>
            <div className="container mt-5 pt-4">
                <div className='p-5 text-center bg-light h-100'>
                    <h1 className="display-4 fw-bold">Error: {status}</h1>
                    <p className="fs-5 mb-4">{message}</p>
                    <a href="/" className="btn btn-success">Back to Home</a>
                </div>
            </div>
        </>
    );
};

ErrorPage.propTypes = {
    status: PropTypes.number,
    message: PropTypes.any
};

export default ErrorPage;