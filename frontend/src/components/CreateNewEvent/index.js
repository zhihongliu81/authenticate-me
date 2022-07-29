import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newEventThunk } from "../../store/groups";
import './CreateNewEvent.css';


const CreateNewEvent = ({ close, groupId }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [venueId, setVenueId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState([]);

    // const [venueIdValidationErrors, setVenueIdValidationErrors] = useState([]);
    const [nameValidationErrors, setNameValidationErrors] = useState([]);
    const [typeValidationErrors, setTypeValidationErrors] = useState([]);
    const [capacityValidationErrors, setCapacityValidationErrors] = useState([]);
    const [priceValidationErrors, setPriceValidationErrors] = useState([]);
    const [descriptionValidationErrors, setDescriptionValidationErrors] = useState([]);
    const [startDateValidationErrors, setStartDateValidationErrors] = useState([]);
    const [endDateValidationErrors, setEndDateValidationErrors] = useState([]);

    const [showVenueIdErrors, setShowVenueIdErrors] = useState(false);
    const [showNameErrors, setShowNameErrors] = useState(false);
    const [showTypeErrors, setShowTypeErrors] = useState(false);
    const [showCapacityErrors, setShowCapacityErrors] = useState(false);
    const [showPriceErrors, setShowPriceErrors] = useState(false);
    const [showDescriptionErrors, setShowDescriptionErrors] = useState(false);
    const [showStartDateErrors, setShowStartDateErrors] = useState(false);
    const [showEndDateErrors, setShowEndDateErrors] = useState(false);

    // useEffect(() => {
    //     const errors = [];
    //     if (venueId.length === 0) errors.push("Venue does not exist");
    //     setVenueIdValidationErrors(errors);
    // }, [venueId])

    useEffect(() => {
        const errors = [];
        if (name.length < 5) errors.push("Name must be at least 5 characters");
        setNameValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors = [];
        if (type !== 'Online' && type !== 'In person') errors.push("Type must be Online or In person");
        setTypeValidationErrors(errors);
    }, [type])

    useEffect(() => {
        const errors = [];
        if (capacity.length === 0) errors.push("Capacity must be an integer")
        if (!Number.isInteger(Number(capacity))) errors.push("Capacity must be an integer");

        setCapacityValidationErrors(errors);
    }, [capacity])

    useEffect(() => {
        const errors = [];
        // if(Number.isNaN(price)) errors.push("Price is invalid");
        if (price.length === 0) errors.push("Price is invalid");
        setPriceValidationErrors(errors);
    }, [price])

    useEffect(() => {
        const errors = [];
        if (description.length === 0) errors.push("Description is required");
        setDescriptionValidationErrors(errors);
    }, [description])

    useEffect(() => {
        const errors = [];
        const now = Date.now();
        const startTime = Date.parse(startDate);
        if (startTime <= now) errors.push("Start date must be in the future");
        setStartDateValidationErrors(errors);
    }, [startDate])


    useEffect(() => {
        const errors = [];
        const startTime = Date.parse(startDate);
        const endTime = Date.parse(endDate);
        if (endTime <= startTime) errors.push("End date is less than start date");
        setEndDateValidationErrors(errors);
    }, [endDate])


    const handleSumbit = async (e) => {
        e.preventDefault();
        const venueId = 1;

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
        <div className="create-event-form-main">
            <span onClick={close} className="create-event-close" title="Close Modal">&times;</span>
            <div>
                <h1 className="create-event-form-title">{`Create Event for Group ${groupId}:`}</h1>
            </div>
            <form className="create-event-form" onSubmit={handleSumbit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className='create-event-error'>{error}</li>
                    ))}
                </ul>
                {/* <div className="create-event-form-venueId">
                    <label htmlFor="create-event-form-venueId-input">venueId</label>
                    <input
                        type={'number'}
                        value={venueId}
                        id="create-event-form-venueId-input"
                        onChange={e => { setVenueId(e.target.value); setShowVenueIdErrors(true) }}></input>
                    <>
                        {showVenueIdErrors && venueIdValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div> */}
                <div className="create-event-form-name">
                    <label htmlFor="create-event-form-name-input">name</label>
                    <input
                        type={'text'}
                        value={name}
                        id="create-event-form-name-input"
                        onChange={e => { setName(e.target.value); setShowNameErrors(true) }}></input>
                    <>
                        {showNameErrors && nameValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-type">
                    <label htmlFor="create-event-form-type-input">type</label>
                    <input
                        type={'text'}
                        placeholder={'Online or In person'}
                        value={type}
                        id="create-event-form-type-input"
                        onChange={e => { setType(e.target.value); setShowTypeErrors(true) }}></input>
                    <>
                        {showTypeErrors && typeValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-capacity">
                    <label htmlFor="create-event-form-capacity-input">capacity</label>
                    <input
                        type={'number'}
                        value={capacity}
                        id="create-event-form-capacity-input"
                        onChange={e => { setCapacity(e.target.value); setShowCapacityErrors(true) }}></input>
                    <>
                        {showCapacityErrors && capacityValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-price">
                    <label htmlFor="create-event-form-price-input">price</label>
                    <input
                        type={'number'}
                        value={price}
                        id="create-event-form-price-input"
                        onChange={e => { setPrice(e.target.value); setShowPriceErrors(true) }}></input>
                    <>
                        {showPriceErrors && priceValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-description">
                    <label htmlFor="create-event-form-description-input">description</label>
                    <input
                        type={'text'}
                        value={description}
                        id="create-event-form-description-input"
                        onChange={e => { setDescription(e.target.value); setShowDescriptionErrors(true) }}></input>
                    <>
                        {showDescriptionErrors && descriptionValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-startDate">
                    <label htmlFor="create-event-form-startDate-input">startDate</label>
                    <input
                        type={'text'}
                        placeholder={"2022-11-19 20:00:00"}
                        value={startDate}
                        id="create-event-form-startDate-input"
                        onChange={e => { setStartDate(e.target.value); setShowStartDateErrors(true) }}></input>
                    <>
                        {showStartDateErrors && startDateValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                <div className="create-event-form-endDate">
                    <label htmlFor="create-event-form-endDate-input">endDate:</label>
                    <input
                        type={'text'}
                        placeholder={"2022-11-20 20:00:00"}
                        value={endDate}
                        id="create-event-form-endDate-input"
                        onChange={e => { setEndDate(e.target.value); setShowEndDateErrors(true) }}></input>
                    <>
                        {showEndDateErrors && endDateValidationErrors.map((error, idx) => (
                            <li key={idx} className='create-event-error'>{error}</li>
                        ))}
                    </>
                </div>
                    <button className="create-event-form-submit-button" type="sumbit" >Sumbit</button>
            </form>
        </div>
    );
}

export default CreateNewEvent;
