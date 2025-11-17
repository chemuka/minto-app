import PropTypes from 'prop-types';
import { Binoculars, PenFill, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const PeopleActionCell = (props) => {
    const { data, user, deletePeople } = props;
  
    return (
        <div className="action-cell-renderer">
            <Link
                className="btn btn-primary btn-sm mx-2"
                to={`/view-person/${data.id}`}
            >
                <Binoculars />
            </Link>
            <Link
                className="btn btn-outline-primary btn-sm mx-2"
                to={`/edit-person`}
            >
                <PenFill />
            </Link>
            { 
                (user.decoded.role === 'Admin') && (
                    <button
                        className="btn btn-danger btn-sm mx-2"
                        onClick={() => deletePeople(data.id)}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </div>
    );
  };
  
export default PeopleActionCell;
  
PeopleActionCell.propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object,
    deletePeople: PropTypes.func
}