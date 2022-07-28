import { NavLink, useParams, Route, Switch, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupDetailsThunk, getMembersThunk } from "../../store/groups";
import GroupEvents from "../GroupEvents";
import CreateNewEvent from "../CreateNewEvent";
import EditGroup from "../EditGroup";
import { deleteGroupThunk } from "../../store/session";
import './GroupDetails.css';



const GroupDetails = () => {
    const {groupId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user);
    const [showForm, setShowForm] = useState(false);
    const [showEditGroupForm, setShowEditGroupForm] = useState(false);

    useEffect(() => {
        dispatch(groupDetailsThunk(groupId));
        // dispatch(getMembersThunk(groupId));
    }, [dispatch, groupId]);


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




    const handleDelete = async (groupId) => {
        const deletedGroup = await dispatch(deleteGroupThunk(groupId));
        if ( deletedGroup.ok ) {
            history.push('/allGroups')
        } else {
            const response = await deletedGroup.json();
            return response;
        }
    }

    if (!group) return null;
    if (!group.members) return null;
    if (!group.Organizer) return null;

    return (
        <div className="group-detail-main">
            <div className="group-detail-top">
                <div>
                    <img className="group-detail-image" alt="group preview image" src="https://secure.meetupstatic.com/photos/event/2/3/a/a/clean_495789130.jpeg" />
                </div>
                <div className="group-detail-topright">
                <div className="group-detail-header">
                    <h2 className="group-detail-name">{group.name}</h2>
                    <h3 className="group-detail-address">{`${group.city}, ${group.state}`}</h3>
                    <h3 className="group-detail-members">{`${Object.keys(group.members).length} members . ${group.private ? 'private' : 'public'}`}</h3>
                    <h3 className="group-detail-header-organizer">Organized by <span className="organizer-name">{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</span></h3>
                </div>
                <div>
                    <div className="group-detail-buttons">
                        {showNewEventButton && <button className="button" onClick={() => setShowForm(true)}>New Event</button>}
                        {showEditGroupButton && <button className="button" onClick={() => setShowEditGroupForm(true)}>Edit Group</button>}
                        {showEditGroupButton && <button className="button" onClick={() => handleDelete(group.id)}>DELETE</button>}
                    </div>
                    <div>
                        {showForm && (
                            <CreateNewEvent hiddenForm={() => setShowForm(false)} groupId={group.id} />
                        )}
                    </div>
                    <div>
                        {showEditGroupForm && (
                            <EditGroup hiddenForm={() => setShowEditGroupForm(false)} group={group} />
                        )}
                    </div>
                </div>

                </div>


            </div>
            <div className="group-detail-navlinks">
                <NavLink to={`/api/groups/${groupId}/events`} className="group-detail-events"><span>Events</span></NavLink>
            </div>
            <div className="group-detail-bottom">
                <div className="group-detail-about">
                    <h2>What we're about</h2>
                    <p>{group.about}</p>
                </div>
                <div className="group-detail-organizer">
                    <h2>Organizers</h2>
                    <p>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                </div>
            </div>
            <Route path={'/api/groups/:groupId/events'}>
                <GroupEvents />
            </Route>
        </div>
        // <div>
        //     <div>{`Group ${group.id}: `}
        //         <NavLink to={`/api/groups/${groupId}/events`}><span>GroupEvents</span></NavLink>
        //     </div>
        //     {`Group ${groupId}: `}
        //     {showNewEventButton && <button onClick={() => setShowForm(true)}>New Event</button>}
        //     <div>
        //         {showForm && (
        //             <CreateNewEvent hiddenForm = {() => setShowForm(false)} groupId = {group.id}/>
        //         )}
        //     </div>
        //     <div>
        //         {showEditGroupButton && <button onClick={() => setShowEditGroupForm(true)}>Edit Group</button>}
        //         {showEditGroupForm && (
        //             <EditGroup hiddenForm = {() => setShowEditGroupForm(false)} group = {group}/>
        //         )}
        //     </div>
        //     <div>{group.id}</div>
        //     <div>{group.name}</div>
        //     <div>{group.about}</div>
        //     <Route path={'/api/groups/:groupId/events'}>
        //         <GroupEvents />
        //     </Route>

        // </div>
    )

}


export default GroupDetails;
