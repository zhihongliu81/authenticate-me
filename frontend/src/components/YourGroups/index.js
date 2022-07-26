import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import { getYourGroupsThunk, deleteGroupThunk } from '../../store/session';
import EditGroup from '../EditGroup';



const YourGroups = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.session.groups);
    // const [name, setName] = useState(group.name);
    // const [about, setAbout] = useState(group.about);
    // const [type, setType] = useState(group.type);
    // const [privateStatus, setPrivateStatus] = useState(group.private);
    // const [city, setCity] = useState(group.city);
    // const [state, setState] = useState(group.state);
    const [showEditGroupForm, setShowEditGroupForm] = useState(false);

    const handleDelete = async (groupId) => {
        const deletedGroup = dispatch(deleteGroupThunk(groupId));
        if ( deletedGroup.ok ) {
            history.push('/yourGroups')
        } else {
            const response = await deletedGroup.json();
            return response;
        }

    }

    const handleEditGroup = async (group) => {
        setShowEditGroupForm(true);

    }

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
            {groupsArr.map((group, index) =>
            <div key={group.id}>
                <div>{`Group ${index + 1}: `}
                    <button onClick={() => handleEditGroup(group)}>Edit Group</button>
                    <button onClick={() => handleDelete(group.id)}>DELETE</button>
                </div>
                <div>
                    {showEditGroupForm && (
                    <EditGroup group={group} hiddenForm={() => setShowEditGroupForm(false)}/>
                    )}
                </div>
                <div>{group.id}</div>
                <div>{group.name}</div>
                <div>{group.about}</div>

            </div>)}
        </div>

    )
};


export default YourGroups;
