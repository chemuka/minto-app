import PropTypes from 'prop-types';

const TextSeparator = ({text}) => {
  return (
    <>
        <div className="py-3 d-flex align-items-center">
            <hr className="flex-grow-1" />
            <p className="text-center my-2">&nbsp; { text } &nbsp;</p>
            <hr className="flex-grow-1" />
        </div>
    </>
  );
};

TextSeparator.propTypes = {
    text: PropTypes.any
};

export default TextSeparator;
