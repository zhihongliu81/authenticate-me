import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newEventThunk } from "../../store/groups";
import { updateEventThunk } from "../../store/events";
import './CreateNewEvent.css';
import { csrfFetch } from "../../store/csrf";


const CreateNewEvent = ({ close, groupId, event, action }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    // const [venueId, setVenueId] = useState('');
    const [name, setName] = useState(action === 'edit'? event.name: '');
    const [type, setType] = useState(action === 'edit'? event.type: '');
    const [capacity, setCapacity] = useState(action === 'edit'? event.capacity: '');
    const [price, setPrice] = useState(action === 'edit'? event.price: 0);
    const [description, setDescription] = useState(action === 'edit'? event.description: '');
    const [startDate, setStartDate] = useState(action === 'edit'? event.startDate: '');
    const [endDate, setEndDate] = useState(action === 'edit'? event.endDate: '');
    const [errors, setErrors] = useState([]);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(action === 'edit'? event.previewImage: '');

    // const [venueIdValidationErrors, setVenueIdValidationErrors] = useState([]);
    const [nameValidationErrors, setNameValidationErrors] = useState([]);
    const [typeValidationErrors, setTypeValidationErrors] = useState([]);
    const [capacityValidationErrors, setCapacityValidationErrors] = useState([]);
    const [priceValidationErrors, setPriceValidationErrors] = useState([]);
    const [descriptionValidationErrors, setDescriptionValidationErrors] = useState([]);
    const [startDateValidationErrors, setStartDateValidationErrors] = useState([]);
    const [endDateValidationErrors, setEndDateValidationErrors] = useState([]);
    const [urlValidationErrors, setUrlValidationErrors] = useState([]);

    // const [showVenueIdErrors, setShowVenueIdErrors] = useState(false);
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
        if (capacity.length === 0) errors.push("Capacity is required")
        if (!Number.isInteger(Number(capacity))) errors.push("Capacity must be an integer");
        if (Number(capacity) <= 0) errors.push("Capacity must be lager than 0")
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
        if(startDate.length === 0) errors.push("Start date is required");
        if (startTime <= now) errors.push("Start date must be in the future");
        setStartDateValidationErrors(errors);
    }, [startDate, endDate])


    useEffect(() => {
        const errors = [];
        const startTime = Date.parse(startDate);
        const endTime = Date.parse(endDate);
        if (endDate.length === 0) errors.push("End date is required");
        if (endTime <= startTime) errors.push("End date is less than start date");
        setEndDateValidationErrors(errors);
    }, [endDate, startDate])

    useEffect(() => {
        const errors =[];
        if (url.length === 0) errors.push("previewImage is required");
        setUrlValidationErrors(errors);
    }, [url])

    const readyToSubmit = nameValidationErrors.length === 0 &&
                          typeValidationErrors.length === 0 &&
                          capacityValidationErrors.length === 0 &&
                          priceValidationErrors.length === 0 &&
                          descriptionValidationErrors.length === 0 &&
                          startDateValidationErrors.length === 0 &&
                          endDateValidationErrors.length === 0 &&
                          url.length > 0

    const handleSubmit = async (e) => {
        e.preventDefault();
        const venueId = 2;

        const newEvent = {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
            previewImage: url
        };
        setErrors([]);
        if (action === 'edit') {
            dispatch(updateEventThunk(event.id, newEvent))
            .then((res) => {
                close()
                history.push(`/events/${res.id}`);
            })
            .catch(async (res) => {
                const data = await res.json();
                if (Object.keys(data.errors).length > 0) {
                    const err = Object.values(data.errors)
                    setErrors(err);
                }
            })
        } else {
            dispatch(newEventThunk(groupId, newEvent))
            .then((res) => {
                close()
                history.push(`/events/${res.id}`);
            })
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (Object.keys(data.errors).length > 0) {
                        const err = Object.values(data.errors)
                        setErrors(err);
                    }
                }
            );
        }

    };

    const uploadImage = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        csrfFetch('/api/images/upload', {
          method: 'POST',
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData
        }).then((res) => res.json()).then((data) => {setUrl(data.url)})

      };

      const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
      };

    return (
        <div className="create-event-form-main">
            <span onClick={close} className="create-event-close" title="Close Modal">&times;</span>
            <div className="create-event-input-container">
                    <div className="create-group-left-container">
                        {url && <img alt="previewImage" src={url} />}
                        <>
                            {urlValidationErrors.map((error, idx) => (
                                <li key={idx} className='create-group-error'>{error}</li>
                            ))}
                        </>
                        <form className="create-group-upload-image" onSubmit={uploadImage}>
                            <label>Upload Preview Image:
                            </label>
                            <input
                                id='file-upload'
                                type="file"
                                accept="image/*"
                                onChange={updateFile} />
                            <button className="upload-picture-button" type="submit">upload image</button>
                        </form>
                    </div>
                <div className="create-event-right-container">
                        <h1 className="create-event-form-title">{action === 'edit' ? `Edit Event: ${event.name}` :`Create Event for Group ${groupId}:`}</h1>
                    <form className="create-event-form" onSubmit={handleSubmit}>
                        <ul>
                            {errors.map((error, idx) => (
                                <li key={idx} className='create-event-error'>{error}</li>
                            ))}
                        </ul>
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
                            <select
                                name='eventType'
                                onChange={e => { setType(e.target.value); setShowTypeErrors(true) }}
                                value={type}
                                id="create-event-form-type-input"
                            >
                                <option value='' disabled>
                                    Select a event type...
                                </option>
                                <option>Online</option>
                                <option>In person</option>
                            </select>
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
                                placeholder={"Capacity must be lager than 0"}
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
                        <button disabled={!readyToSubmit} className={readyToSubmit ? "create-event-form-submit-button" : "not-ready-to-create-event"} type="sumbit" >Sumbit</button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default CreateNewEvent;
