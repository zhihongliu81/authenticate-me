import { NavLink, useParams, Route, Switch, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Modal} from '../../context/Modal';
import { groupDetailsThunk } from "../../store/groups";
import { getMembersThunk, deleteMemberThunk, requestMemberThunk, updateMemberThunk } from "../../store/members";
import GroupEvents from "../GroupEvents";
import CreateNewEvent from "../CreateNewEvent";
import EditGroup from "../EditGroup";
import { deleteGroupThunk } from "../../store/session";
import './GroupDetails.css';
import addressIcon from '../../images/address.png';
import membersIcon from '../../images/members.png';
import organizerIcon from '../../images/organizer.png';



const GroupDetails = () => {
    const {groupId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user);
    const members = useSelector(state => state.members);
    const [showForm, setShowForm] = useState(false);
    const [showEditGroupForm, setShowEditGroupForm] = useState(false);
    const [groupDetailsIsLoaded, setGroupDetailsIsLoaded] = useState(false);
    const [membersIsLoaded, setMembersIsLoaded] = useState(false);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
    const [currentMember, setCurrentMember] = useState({});
    const [status, setStatus] = useState('');
    const [statusValidationErrors, setStatusValidationErrors] = useState([]);
    const [membershipErrors, setMembershipErrors] = useState([]);


    useEffect(() => {
        dispatch(groupDetailsThunk(groupId)).then(() => setGroupDetailsIsLoaded(true));
        dispatch(getMembersThunk(groupId)).then(() => setMembersIsLoaded(true));
    }, [dispatch, groupId]);

    useEffect(() => {
        if (status.length === 0) {
            setStatusValidationErrors(["Status is required"])
        };
    }, [status])


    let showNewEventButton = false;
    if(user && group) {
        const userId = user.id;
        const membership = Object.values(members).filter(ele => ele.memberId === userId);
            if (membership.length > 0) {
                const memberStatus = membership[0].status;
                if (group.organizerId === userId || memberStatus === 'co-host') {
                    showNewEventButton = true;
                }
            }
    }

    let showEditGroupButton = false;
    let statusList = ['member']
    if (user && group) {
        if (user.id && group.organizerId && user.id === group.organizerId) {
          showEditGroupButton = true;
          statusList = ['member', 'co-host'];
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

    let pendingMembers = [];
    let isMembers = [];
    const membersList = Object.values(members);
    for (let i = 0; i < membersList.length; i++ ) {
        let member = membersList[i];
        if (member.status === 'pending') {
            pendingMembers.push(member)
        }else {
            isMembers.push(member)
        }
    }


    let inGroup = [];
    let showPendingMembers = false;
    if (user) {
        inGroup = membersList.filter(member => member.memberId === user.id);
        if(inGroup.length > 0 && inGroup[0].status === 'co-host' || group.organizerId === user.id) {
            showPendingMembers = true;
        }
    }

    const handleMembership = (groupId) => {
        setMembershipErrors([]);
        if (inGroup.length > 0) {
            // leave the group
            dispatch(deleteMemberThunk(groupId, user.id))
            .catch((data) => {
                const error = data.message
                if (error) {
                    setMembershipErrors([error])
                }
            })

        } else {
            // request joining the group
            dispatch(requestMemberThunk(groupId))
            .catch((data) => {
                const error = data.message
                if (error) {
                    setMembershipErrors([error])
                }
            })
        }
    }

    const updateStatus = (e) => {
        e.preventDefault();
        if (status.length > 0) {
            dispatch(updateMemberThunk(groupId, currentMember, status))
            .then(() => { setShowUpdateStatusModal(false)});
        }
    }



    return <>{groupDetailsIsLoaded && membersIsLoaded &&
        <div className="group-detail-main">
            <div className="group-detail-top">
                <img className="group-detail-image" alt="group preview image" src={group.previewImage}/>
                <div className="group-detail-topright">
                    <h2 className="group-detail-name">{group.name}</h2>
                    <div>
                        <img alt="address" src={addressIcon} />
                        <h3 className="group-detail-address">{`${group.city}, ${group.state}`}</h3>
                    </div>
                    <div>
                        <img alt="members" src={membersIcon} />
                        {<h3 className="group-detail-members">{`${membersList.length} members . ${group.private ? 'private' : 'public'}`}</h3>}
                    </div>
                    <div>
                        <img alt="organizer" src={organizerIcon} />
                        {group.Organizer && <h3 className="group-detail-header-organizer">Organized by <span className="organizer-name">{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</span></h3>}
                    </div>
                    <div>
                        <div className="group-detail-buttons">
                            {showNewEventButton && <button className="button" onClick={() => setShowCreateEventModal(true)}>New Event</button>}
                            {showEditGroupButton && <button className="button" onClick={() => setShowEditGroupModal(true)}>Edit Group</button>}
                            {showEditGroupButton && <button className="button" onClick={() => setShowDeleteGroupModal(true)}>DELETE</button>}
                        </div>
                        <div>
                            {showCreateEventModal && (
                                <Modal onClose={() => setShowCreateEventModal(false)}>
                                    <CreateNewEvent close={() => setShowCreateEventModal(false)} groupId={group.id} />
                                </Modal>
                            )}
                        </div>
                        <div>
                            {showEditGroupModal && (
                                <Modal onClose={() => setShowEditGroupModal(false)}>
                                    <EditGroup close={() => setShowEditGroupModal(false)} group={group} />
                                </Modal>
                            )}
                        </div>
                        <>
                        {showDeleteGroupModal &&
                            <Modal onClose={() => setShowDeleteGroupModal(false)}>
                            <div className='delete-modal-container'>
                                <h2>Are you sure you would like to delete group: {group.name}?</h2>
                                <div>
                                    <button className='delete-modal-button' onClick={() => { handleDelete(groupId) }}>Delete</button>
                                    <button className='delete-modal-button' onClick={() => setShowDeleteGroupModal(false)}>Cancle</button>
                                </div>
                            </div>
                        </Modal>
                        }
                        </>
                    </div>
                </div>
            </div>
            <div className="group-detail-bottom">
                <div className="group-detail-bottom-left">
                    <NavLink to={`/api/groups/${groupId}/events`} className="group-detail-events"><span>Events</span></NavLink>
                    <div className="group-detail-about">
                        <h2>What we're about</h2>
                        <p>{group.about}</p>
                    </div>
                    <Route path={'/api/groups/:groupId/events'}>
                        <GroupEvents />
                    </Route>
                </div>
                <div className="group-detail-bottom-right">
                    <>
                        {membershipErrors.map((error, idx) => (
                            <li key={idx} className='error'>{error}</li>
                        ))}
                    </>
                    {user && user.id !== group.organizerId && <button className="group-join-leave-button" onClick={() => { handleMembership(groupId) }}>{inGroup.length > 0 ? 'Leave this Group' : 'Join this Group'}</button>}
                    <div className="group-detail-organizer">
                        <h2>Organizers</h2>
                        <p>{`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
                    </div>
                    <div className="group-detail-members-container">
                        <div className="group-detail-members">
                            <h2>Members:</h2>
                            {
                                isMembers.map(ele => {
                                    return (
                                        <p key={ele.id}>{ele.firstName} {ele.lastName}</p>
                                    )
                                })
                            }
                        </div>
                        {showPendingMembers &&
                            <div className="group-detail-pending-members">
                                <h2>Pending members:</h2>
                                {pendingMembers.map(ele => {
                                    return (
                                        <div key={ele.id}>
                                            <p>{ele.firstName} {ele.lastName}</p>
                                            <button className="pending-members-button" onClick={() => { setCurrentMember(ele); setShowUpdateStatusModal(true) }}>Update Status</button>
                                        </div>
                                    )
                                })}
                                {showUpdateStatusModal &&
                                    <Modal onClose={() => setShowUpdateStatusModal(false)}>
                                        <div className="update-status-modal-container">
                                            <h2>Update Status of {currentMember.firstName} {currentMember.lastName}</h2>
                                            <>
                                                {statusValidationErrors.map((error, idx) => (
                                                    <li key={idx} className='error'>{error}</li>
                                                ))}
                                            </>
                                            <form className="update-status-modal-form" onSubmit={(e) => updateStatus(e)}>
                                                <select
                                                    name="status"
                                                    onChange={e => { setStatusValidationErrors([]); setStatus(e.target.value) }}
                                                    value={status}
                                                >
                                                    <option value={''} disabled>select the status...</option>
                                                    {statusList.map((ele => {
                                                        return (
                                                            <option key={ele} value={ele}>{ele}</option>
                                                        )
                                                    }))}
                                                </select>
                                                <button className="">Update Status</button>
                                            </form>
                                        </div>
                                    </Modal>
                                }
                            </div>
                        }
                    </div>


                </div>
            </div>

        </div>}
    </>

}


export default GroupDetails;
