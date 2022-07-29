import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newEventThunk } from "../../store/groups";


const CreateNewEvent = ({close, groupId}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [venueId, setVenueId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] =useState([]);

    const [venueIdValidationErrors, setVenueIdValidationErrors] = useState([]);
    const [nameValidationErrors, setNameValidationErrors] = useState([]);
    const [typeValidationErrors, setTypeValidationErrors] = useState([]);
    const [capacityValidationErrors, setCapacityValidationErrors] = useState([]);
    const [priceValidationErrors, setPriceValidationErrors] = useState([]);
    const [descriptionValidationErrors, setDescriptionValidationErrors] = useState([]);
    const [startDateValidationErrors, setStartDateValidationErrors] = useState([]);
    const [EndDateValidationErrors, setEndDateValidationErrors] = useState([]);

    const [showVenueIdErrors, setShowVenueIdErrors] = useState(false);
    const [showNameErrors, setShowNameErrors] = useState(false);
    const [showTypeErrors, setShowTypeErrors] = useState(false);
    const [showCapacityErrors, setShowCapacityErrors] = useState(false);
    const [showPriceErrors, setShowPriceErrors] = useState(false);
    const [showDescriptionErrors, setShowDescriptionErrors] = useState(false);
    const [showStartDateErrors, setShowStartDateErrors] = useState(false);
    const [showEndDateErrors, setShowEndDateErrors] = useState(false);

    useEffect(() => {
        const errors =[];
        if(venueId.length === 0) errors.push("Venue does not exist");
        setVenueIdValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        if(name.length < 5) errors.push("Name must be at least 5 characters");
        setNameValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        if (type !== 'Online' && type !== 'In person') errors.push("Type must be Online or In person");
        setTypeValidationErrors(errors);
    }, [type])

    useEffect(() => {
        const errors =[];
        if(!Number.isInteger(capacity)) errors.push("Capacity must be an integer");
        setCapacityValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        if(Number.isNaN(price)) errors.push("Price is invalid");
        setPriceValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        if(description.length === 0) errors.push("Description is required");
        setDescriptionValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        const now = Date.now();
        const startTime = Date.parse(startDate);
        if(startTime <= now) errors.push("Start date must be in the future");
        setStartDateValidationErrors(errors);
    }, [name])


    useEffect(() => {
        const errors =[];
        const startTime = Date.parse(startDate);
        const endTime = Date.parse(endDate);
        if(endTime <= startTime) errors.push("End date is less than start date");
        setEndDateValidationErrors(errors);
    }, [name])


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
      <div>
      <label>venueId:</label>
      <input type={'number'} value={venueId} onChange={e => setVenueId(e.target.value)}></input>
      </div>
      <div>
      <label>name:</label>
      <input type={'text'} value={name} onChange={e => setName(e.target.value)}></input>
      </div>
      <div>
      <label>type:</label>
      <input type={'text'} value={type} onChange={e => setType(e.target.value)}></input>
      </div>
      <div>
      <label>capacity:</label>
      <input type={'number'} value={capacity} onChange={e => setCapacity(e.target.value)}></input>
      </div>
      <div>
      <label>price:</label>
      <input type={'number'} value={price} onChange={e => setPrice(e.target.value)}></input>
      </div>
      <div>
      <label>description:</label>
      <input type={'text'} value={description} onChange={e => setDescription(e.target.value)}></input>
      </div>
      <div>
      <label>startDate:</label>
      <input type={'text'} value={startDate} onChange={e => setStartDate(e.target.value)}></input>
      </div>
      <div>
      <label>endDate:</label>
      <input type={'text'} value={endDate} onChange={e => setEndDate(e.target.value)}></input>
      </div>
      <div>
      <button type="sumbit" >Sumbit</button>
                <button onClick={close}>Cancle</button>
      </div>

            </form>

        </div>
    );
}

export default CreateNewEvent;
