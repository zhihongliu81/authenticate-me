import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import { getYourGroupsThunk, deleteGroupThunk } from '../../store/session';
// import EditGroup from '../EditGroup';
import GroupCard from '../AllGroupsList/GroupCard.js';
import './YourGroups.css';



const YourGroups = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const [yourGroupsIsLoaded, setYourGroupsIsLoaded] = useState(false);

    // const [showEditGroupForm, setShowEditGroupForm] = useState(false);
    // const [buttonIndex, setButtonIndex] = useState(0);

    // const handleDelete = async (groupId) => {
    //     const deletedGroup = await dispatch(deleteGroupThunk(groupId));
    //     if ( deletedGroup.ok ) {
    //         history.push('/yourGroups')
    //     } else {
    //         const response = await deletedGroup.json();
    //         return response;
    //     }
    // }

    // const handleEditGroup = async (group, index) => {
    //     setButtonIndex(index);
    //     setShowEditGroupForm(true);

    // }

    useEffect(() => {
        dispatch(getYourGroupsThunk(user)).then(() => {
            setYourGroupsIsLoaded(true);
        });
    }, [dispatch])

    if (!user) {
        history.push('/signup');
        return
    }


    if (!groups) return null ;

    const groupsArr = Object.values(groups);
    return (
        <div className='your-groups-main-container'>
            <div>
            <h1>You have {groupsArr.length} {groupsArr.length === 1 ? 'group' : 'groups'}</h1>
            <div>
                {yourGroupsIsLoaded &&
                    groupsArr.map((group, index) =>
                        <div key={group.id}>
                            <GroupCard group={group} />
                        </div>)}
            </div>
            </div>


        </div>
    )


};


export default YourGroups;
