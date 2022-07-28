import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loadGroupsThunk } from '../../store/groups';
import GroupCard from './GroupCard';


const AllGroups = () => {
    const groups = useSelector(state => Object.values(state.groups));
    const dispatch = useDispatch();
    const [groupsIsLoaded, setGroupsIsloaded] = useState(false);

    useEffect(() => {
        dispatch(loadGroupsThunk()).then(() => setGroupsIsloaded(true));
    }, [dispatch]);

    if (groups.length === 0) {
        return null
    }

    return <div>
{groupsIsLoaded && groups.map(group => (<div
    key={group.id}><GroupCard  group={group}/>
        </div>))}
    </div>


}



export default AllGroups;
