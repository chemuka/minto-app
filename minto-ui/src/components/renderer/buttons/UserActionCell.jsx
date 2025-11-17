import PropTypes from 'prop-types';
import { Binoculars, PenFill, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const UserActionCell = (props) => {
    const { data, user, deleteUser } = props;
  
    return (
        <div className="action-cell-renderer">
            <Link
                className="btn btn-primary btn-sm mx-2"
                to={`/view-user/${data.email}`}
            >
                <Binoculars />
            </Link>
            <Link
                className="btn btn-outline-primary btn-sm mx-2"
                to={`/edit-user`}
            >
                <PenFill />
            </Link>
            { 
                (user.decoded.role === 'Admin') && (
                    <button
                        className="btn btn-danger btn-sm mx-2"
                        onClick={() => deleteUser(data.email)}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </div>
    );
  };
  
export default UserActionCell;
  
UserActionCell.propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object,
    deleteUser: PropTypes.func
}