import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newEventThunk } from "../../store/groups";


const CreateNewEvent = ({hiddenForm, groupId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [venueId, setVenueId] = useState();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSumbit = async (e) => {
        e.preventDefault();

        const newEvent = {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        };
        let createdNewEvent;
        try {
            createdNewEvent = await dispatch(newEventThunk(groupId, newEvent));

        } catch (error) {
            console.log(error);
        }

        if (createdNewEvent) {
            history.push(`/api/events/${createdNewEvent.id}`);
            hiddenForm();
        }

    };

    return (
        <div>{`Create New Event for Group ${groupId}:`}
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

export default CreateNewEvent;
