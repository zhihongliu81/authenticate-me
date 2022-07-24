import { NavLink, useParams, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupDetailsThunk } from "../../store/groups";
import GroupEvents from "../GroupEvents";
import CreateNewEvent from "../CreateNewEvent";


const GroupDetails = () => {
    const {groupId} = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(groupDetailsThunk(groupId));
    }, [dispatch, groupId]);

    if (!group) return null;

    return (
        <div>
            <div>{`Group ${group.id}: `}
                <NavLink to={`/api/groups/${groupId}/events`}><span>GroupEvents</span></NavLink>
            </div>

            {`Group ${groupId}: `}
            <button onClick={() => setShowForm(true)}>New Event</button>
            <div>
                {showForm && (
                    <CreateNewEvent hiddenForm = {() => setShowForm(false)} groupId = {group.id}/>
                )}
            </div>
            <Route path={'/api/groups/:groupId/events'}>
                <GroupEvents />
            </Route>

        </div>
    )

}


export default GroupDetails;
