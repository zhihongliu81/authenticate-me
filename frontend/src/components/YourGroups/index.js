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

    const [showEditGroupForm, setShowEditGroupForm] = useState(false);
    const [buttonIndex, setButtonIndex] = useState(0);

    const handleDelete = async (groupId) => {
        const deletedGroup = await dispatch(deleteGroupThunk(groupId));
        if ( deletedGroup.ok ) {
            history.push('/yourGroups')
        } else {
            const response = await deletedGroup.json();
            return response;
        }
    }

    const handleEditGroup = async (group, index) => {
        setButtonIndex(index);
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
                    <button onClick={() => handleEditGroup(group, index)} id={index}>Edit Group</button>
                    <button onClick={() => handleDelete(group.id)}>DELETE</button>
                </div>
                <div>
                    {showEditGroupForm && (index === buttonIndex) && (
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
