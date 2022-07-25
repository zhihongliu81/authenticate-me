import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { getYourGroupsThunk } from '../../store/session';


const YourGroups = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.session.groups);
    
    useEffect(() => {
        dispatch(getYourGroupsThunk(user));
    }, [dispatch])

    if (!user) {
        history.push('/signup');
        return
    }


    if (!groups) return null;
    const groupsArr = Object.values(groups);


    return (
        <div>Your Groups:
            {groupsArr.map(group => <div key={group.id}>{group.id}</div>)}
        </div>
    )
};


export default YourGroups;
