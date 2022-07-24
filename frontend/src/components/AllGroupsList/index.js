import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loadGroupsThunk } from '../../store/groups';

const AllGroups = () => {
    const groups = useSelector(state => Object.values(state.groups));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGroupsThunk());
    }, [dispatch]);

    if (groups.length === 0) {
        return null
    }

    return groups.map(group => (
        <div key={group.id}>{`Group ${group.id}: `}
           <NavLink to={`/api/groups/${group.id}`}>{`Group ${group.id}`}</NavLink>

        </div>
    ))
}



export default AllGroups;
