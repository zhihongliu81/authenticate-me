import { NavLink, useParams, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupDetailsThunk, getMembersThunk } from "../../store/groups";
import GroupEvents from "../GroupEvents";
import CreateNewEvent from "../CreateNewEvent";
import EditGroup from "../EditGroup";



const GroupDetails = () => {
    const {groupId} = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user);
    const [showForm, setShowForm] = useState(false);
    const [showEditGroupForm, setShowEditGroupForm] = useState(false);


    let showNewEventButton = false;
    if(user && group) {
        const userId = user.id;

        if(group.members && Object.keys(group.members).length > 0) {
            if (group.members[userId]) {
                const membership = group.members[userId].Membership.status;
                if (membership === 'organizer' || membership === 'co-host') {
                    showNewEventButton = true;
                }
            }

        }
    }

    let showEditGroupButton = false;
    if (user && group) {
        if (user.id && group.organizerId && user.id === group.organizerId) {
          showEditGroupButton = true;
        }
    }


    useEffect(() => {
        dispatch(groupDetailsThunk(groupId));
        dispatch(getMembersThunk(groupId));
    }, [dispatch, groupId]);

    if (!group) return null;

    return (
        <div>
            <div>{`Group ${group.id}: `}
                <NavLink to={`/api/groups/${groupId}/events`}><span>GroupEvents</span></NavLink>
            </div>
            {`Group ${groupId}: `}
            {showNewEventButton && <button onClick={() => setShowForm(true)}>New Event</button>}
            <div>
                {showForm && (
                    <CreateNewEvent hiddenForm = {() => setShowForm(false)} groupId = {group.id}/>
                )}
            </div>
            <div>
                {showEditGroupButton && <button onClick={() => setShowEditGroupForm(true)}>Edit Group</button>}
                {showEditGroupForm && (
                    <EditGroup hiddenForm = {() => setShowEditGroupForm(false)} groupId = {group.id}/>
                )}
            </div>
            <div>{group.id}</div>
            <div>{group.name}</div>
            <div>{group.about}</div>
            <Route path={'/api/groups/:groupId/events'}>
                <GroupEvents />
            </Route>

        </div>
    )

}


export default GroupDetails;
