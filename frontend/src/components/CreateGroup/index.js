import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { newGroupThunk } from "../../store/groups";



const CreateGroup = ({close}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.user);

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privateStatus, setPrivateStatus] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

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
        if (privateStatus !== true || privateStatus !== false) errors.push("Private must be a boolean");
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




    // if (!user) history.push('/login');

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
        // return dispatch(newGroupThunk(newGroup)).catch(
        //   async (res) => {
        //     const data = await res.json();
        //     if (Object.keys(data.errors).length > 0) {
        //       const err = Object.values(data.errors)
        //       setErrors(err);
        //     }
        //   }
        // )
         const res = await dispatch(newGroupThunk(newGroup));
         console.log(res.ok)

        if (res.ok) {
          const createdNewGroup = await res.json();
          // console.log('createdNewGroup:',createdNewGroup)
            history.push(`/api/groups/${createdNewGroup.id}`);
            // hiddenForm();
        } else {

            const data = await res.json();
            console.log(data)
            if (Object.keys(data.errors).length > 0) {
                const err = Object.values(data.errors)
                setErrors(err);
              }
            }
    };


  return (<div>
    <div>
      <h1> Create Group</h1>
    </div>
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx} className='create-group-error'>{error}</li>
        ))}
      </ul>
      <div>
        <label>name:</label>
        <input
          type={'text'}
          value={name}
          onChange={e => { setName(e.target.value); setShowNameErrors(true) }} />
        <>
          {showNameErrors && nameValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <div>
        <label>about:</label>
        <input
          type={'text'}
          value={about}
          onChange={e => { setAbout(e.target.value); setShowAboutErrors(true) }} />
        <>
          {showAboutErrors && aboutValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <div>
        <label>type:</label>
        <input
          type={'text'}
          value={type}
          onChange={e => { setType(e.target.value); setShowTypeErrors(true) }} />
        <>
          {showTypeErrors && typeValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <div>
        <label>private:</label>
        <input
          type={'boolean'}
          value={privateStatus}
          onChange={e => { setPrivateStatus(e.target.value); setShowPrivateErrors(true) }} />
        <>
          {showPrivateErrors && privateValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <div>
        <label>city:</label>
        <input
          type={'text'}
          value={city}
          onChange={e => { setCity(e.target.value); setShowCityErrors(true) }} />
        <>
          {showCityErrors && cityValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <div>
        <label>state:</label>
        <input
          type={'text'}
          value={state}
          onChange={e => { setState(e.target.value); setShowStateErrors(true) }} />
        <>
          {showStateErrors && stateValidationErrors.map((error, idx) => (
            <li key={idx} className='create-group-error'>{error}</li>
          ))}
        </>
      </div>
      <button type="submit" >Submit</button>
      {/* <button onClick={hiddenForm}>Cancle</button> */}
    </form>

  </div>





    );
};


export default CreateGroup;
