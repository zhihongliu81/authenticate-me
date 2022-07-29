import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newEventThunk } from "../../store/groups";


const CreateNewEvent = ({close, groupId}) => {
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
    const [errors, setErrors] =useState([]);

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
        setErrors([]);
        dispatch(newEventThunk(groupId, newEvent)).then((res) => {
            close()
            history.push(`/api/events/${res.id}`);
          }).catch(
            async (res) => {
                const data = await res.json();
                if (Object.keys(data.errors).length > 0) {
                          const err = Object.values(data.errors)
                          setErrors(err);
                }
            }
        );
        // let createdNewEvent;
        // try {
        //     createdNewEvent = await dispatch(newEventThunk(groupId, newEvent));

        // } catch (error) {
        //     console.log(error);
        // }

        // if (createdNewEvent) {
        //     close();
        //     history.push(`/api/events/${createdNewEvent.id}`);

        // }

    };

    return (
        <div>{`Create New Event for Group ${groupId}:`}
            <form onSubmit={handleSumbit}>
            <ul>
        {errors.map((error, idx) => (
          <li key={idx} className='create-group-error'>{error}</li>
        ))}
      </ul>
                <label>venueId:<input type={'number'} value={venueId} onChange={e => setVenueId(e.target.value)}></input></label>
                <label>name:<input type={'text'} value={name} onChange={e => setName(e.target.value)}></input></label>
                <label>type:<input type={'text'} value={type} onChange={e => setType(e.target.value)}></input></label>
                <label>capacity:<input type={'number'} value={capacity} onChange={e => setCapacity(e.target.value)}></input></label>
                <label>price:<input type={'number'} value={price} onChange={e => setPrice(e.target.value)}></input></label>
                <label>description:<input type={'text'} value={description} onChange={e => setDescription(e.target.value)}></input></label>
                <label>startDate:<input type={'text'} value={startDate} onChange={e => setStartDate(e.target.value)}></input></label>
                <label>endDate:<input type={'text'} value={endDate} onChange={e => setEndDate(e.target.value)}></input></label>
                <button type="sumbit" >Sumbit</button>
                <button onClick={close}>Cancle</button>
            </form>

        </div>
    );
}

export default CreateNewEvent;
