import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { eventDetailsThunk } from "../../store/events";

const EventDetails = () => {
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events[eventId]);

    useEffect(() => {
        dispatch(eventDetailsThunk(eventId));
    }, [dispatch, eventId]);


    if (!event) return null;
    return (
        <>
            <div>
                {`Event ${event.id}: `}
            </div>
            <div>{ event.id }</div>
            <div>{ event.description }</div>
        </>

    );
}


export default EventDetails;
