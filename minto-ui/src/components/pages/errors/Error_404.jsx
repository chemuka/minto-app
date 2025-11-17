import '../errors/error_404.css'

const Error_404 = () => {
  return (
    <>
      <div className="container body-error-404 px-0">
        <div className="noise"></div>
        <div className="overlay"></div>
        <div className="terminal">
          <h1 className='mt-3'>Error <span className="errorcode">404</span></h1>
          <p className="output">Oops! ... Page cannot be found.</p>
          <p className="output">Please try to go back or return to the <a href="/">home page</a>.</p>
          <p className="output">Good luck.</p>
        </div>
      </div>
    </>
  );
};

export default Error_404