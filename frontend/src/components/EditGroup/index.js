import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateGroupThunk } from "../../store/groups";


const EditGroup = ({close, group}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [privateStatus, setPrivateStatus] = useState(group.private);
    const [city, setCity] = useState(group.city);
    const [state, setState] = useState(group.state);

    const [nameValidationErrors, setNameValidationErrors] = useState([]);
    const [aboutValidationErrors, setAboutValidationErrors] = useState([]);
    const [typeValidationErrors, setTypeValidationErrors] = useState([]);
    const [privateValidationErrors, setPrivateValidationErrors] = useState([]);
    const [cityValidationErrors, setCityValidationErrors] = useState([]);
    const [stateValidationErrors, setStateValidationErrors] = useState([]);
    const [errors, setErrors] =useState([]);

    const [showNameErrors, setShowNameErrors] = useState(false);
    const [showAboutErrors, setShowAboutErrors] = useState(false);
    const [showTypeErrors, setShowTypeErrors] = useState(false);
    const [showPrivateErrors, setShowPrivateErrors] = useState(false);
    const [showCityErrors, setShowCityErrors] = useState(false);
    const [showStateErrors, setShowStateErrors] = useState(false);

    useEffect(() => {
        const errors =[];
        if(name.length > 60 || name.length === 0) errors.push("Name must be 60 characters or less");
        setNameValidationErrors(errors);
    }, [name])

    useEffect(() => {
        const errors =[];
        if (about.length < 50) errors.push("About must be 50 characters or more");
        setAboutValidationErrors(errors);
    }, [about])

    useEffect(() => {
        const errors =[];
        if (type !== 'Online' && type !== 'In person') errors.push("Type must be Online or In person");
        setTypeValidationErrors(errors);
    }, [type])

    useEffect(() => {
        const errors =[];
        if (privateStatus !== 'true' && privateStatus !== 'false') errors.push("Private must be a boolean");
        setPrivateValidationErrors(errors);
    }, [privateStatus])

    useEffect(() => {
        const errors =[];
        if (city.length === 0) errors.push("City is required");
        setCityValidationErrors(errors);
    }, [city])

    useEffect(() => {
        const errors =[];
        if (state.length === 0) errors.push("State is required");
        setStateValidationErrors(errors);
    }, [state])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGroup = {
            name,
            about,
            type,
            private: privateStatus,
            city,
            state
        };
        setErrors([]);
        dispatch(updateGroupThunk(newGroup, group.id)).then((res) => {
          close()
          history.push(`/api/groups/${res.id}`);
        }).catch(
          async (res) => {
              const data = await res.json();
              if (Object.keys(data.errors).length > 0) {
                        const err = Object.values(data.errors)
                        setErrors(err);
              }
          }
      );
    };

    return (
        <div className="create-group-form-main">
          <span onClick={close} className="close" title="Close Modal">&times;</span>
          <div>
            <h1 className="create-form-title"> Edit Group</h1>
          </div>
          <form onSubmit={handleSubmit} className="create-group-form">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx} className='create-group-error'>{error}</li>
              ))}
            </ul>
            <div className="create-group-form-name">
              <label>name:</label>
              <input
                type={'text'}
                value={name}
                id="create-group-form-name-input"
                onChange={e => { setName(e.target.value); setShowNameErrors(true) }} />
              <>
                {showNameErrors && nameValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-about">
              <label>about:</label>
              <input
                type={'text'}
                value={about}
                id="create-group-form-about-input"
                onChange={e => { setAbout(e.target.value); setShowAboutErrors(true) }} />
              <>
                {showAboutErrors && aboutValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-type">
              <label>type:</label>
              <input
                type={'text'}
                value={type}
                id="create-group-form-type-input"
                onChange={e => { setType(e.target.value); setShowTypeErrors(true) }} />
              <>
                {showTypeErrors && typeValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-private">
              <label>private:</label>
              <input
                type={'boolean'}
                value={privateStatus}
                id="create-group-form-private-input"
                onChange={e => { setPrivateStatus(e.target.value); setShowPrivateErrors(true) }} />
              <>
                {showPrivateErrors && privateValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-city">
              <label>city:</label>
              <input
                type={'text'}
                value={city}
                id="create-group-form-city-input"
                onChange={e => { setCity(e.target.value); setShowCityErrors(true) }} />
              <>
                {showCityErrors && cityValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-state">
              <label>state:</label>
              <input
                type={'text'}
                value={state}
                id="create-group-form-state-input"
                onChange={e => { setState(e.target.value); setShowStateErrors(true) }} />
              <>
                {showStateErrors && stateValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <button type="submit" className="create-group-form-submit-button" >Submit</button>
          </form>
        </div>
          );
};


export default EditGroup;
