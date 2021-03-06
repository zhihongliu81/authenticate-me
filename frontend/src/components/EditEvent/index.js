import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateEventThunk } from "../../store/events";
import { useState } from "react";

const EditEvent = ({hiddenForm, eventId}) => {
    const event = useSelector(state => state.events[eventId]);
    const dispatch = useDispatch();
    const history = useHistory();

    const [venueId, setVenueId] = useState(event.venueId);
    const [name, setName] = useState(event.name);
    const [type, setType] = useState(event.type);
    const [capacity, setCapacity] = useState(event.capacity);
    const [price, setPrice] = useState(event.price);
    const [description, setDescription] = useState(event.description);
    const [startDate, setStartDate] = useState(event.startDate);
    const [endDate, setEndDate] = useState(event.endDate);

    const handleSumbit = async (e) => {
        e.preventDefault();
        const updatedEvent = {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        };

        let newEvent;
        try {
            newEvent = await dispatch(updateEventThunk(eventId, updatedEvent));
        } catch(error) {
            console.log(error);
        }

        if (newEvent) {
            history.push(`/api/events/${eventId}`);
            hiddenForm();
        }
    }

    return (
        <div>{`Update Event for Event ${eventId}:`}
            <form onSubmit={handleSumbit}>
                <label>venueId:<input type={'number'} value={venueId} onChange={e => setVenueId(e.target.value)}></input></label>
                <label>name:<input type={'text'} value={name} onChange={e => setName(e.target.value)}></input></label>
                <label>type:<input type={'text'} value={type} onChange={e => setType(e.target.value)}></input></label>
                <label>capacity:<input type={'number'} value={capacity} onChange={e => setCapacity(e.target.value)}></input></label>
                <label>price:<input type={'number'} value={price} onChange={e => setPrice(e.target.value)}></input></label>
                <label>description:<input type={'text'} value={description} onChange={e => setDescription(e.target.value)}></input></label>
                <label>startDate:<input type={'text'} value={startDate} onChange={e => setStartDate(e.target.value)}></input></label>
                <label>endDate:<input type={'text'} value={endDate} onChange={e => setEndDate(e.target.value)}></input></label>
                <button type="sumbit" >Sumbit</button>
                <button onClick={hiddenForm}>Cancle</button>
            </form>


        </div>
    );
}


export default EditEvent;
