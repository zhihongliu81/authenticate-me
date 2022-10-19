import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { newGroupThunk } from "../../store/groups";
import './CreateGroup.css';
import { csrfFetch } from "../../store/csrf";



const CreateGroup = ({close}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.user);

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privateStatus, setPrivateStatus] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [url, setUrl] = useState('');

    const [nameValidationErrors, setNameValidationErrors] = useState([]);
    const [aboutValidationErrors, setAboutValidationErrors] = useState([]);
    const [typeValidationErrors, setTypeValidationErrors] = useState([]);
    const [privateValidationErrors, setPrivateValidationErrors] = useState([]);
    const [cityValidationErrors, setCityValidationErrors] = useState([]);
    const [stateValidationErrors, setStateValidationErrors] = useState([]);
    const [urlValidationErrors, setUrlValidationErrors] = useState([]);
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
        if (privateStatus.length === 0) errors.push("Private is required");
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

    useEffect(() => {
      const errors =[];
      if (url.length === 0) errors.push("previewImage is required");
      setUrlValidationErrors(errors);
  }, [url])




    // if (!user) history.push('/login');
    const readyToSubmit = nameValidationErrors.length === 0 &&
                          aboutValidationErrors.length === 0 &&
                          typeValidationErrors.length === 0 &&
                          privateValidationErrors.length === 0 &&
                          cityValidationErrors.length === 0 &&
                          stateValidationErrors.length === 0 &&
                          url.length > 0

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGroup = {
            name,
            about,
            type,
            private: privateStatus,
            city,
            state,
            previewImage: url
        };
        setErrors([]);
        dispatch(newGroupThunk(newGroup)).then((res) => {
          close()
          history.push(`/groups/${res.id}`);
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


    const uploadImage = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", image);

      setImageLoading(true);

      csrfFetch('/api/images/upload', {
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData
      }).then((res) => res.json())
      .then((data) => {setUrl(data.url); setImageLoading(false)})

    };

    const updateFile = (e) => {
      const file = e.target.files[0];
      if (file) setImage(file);
    };

  return (
    <div className="create-group-form-main">
      <span onClick={close} className="close" title="Close Modal">&times;</span>
      <div className="create-group-input-container">
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
            {(imageLoading) && <p>Loading...</p>}
          </form>
        </div>
        <div>
          <div>
            <h1 className="create-form-title"> Create Group</h1>
          </div>
          <form onSubmit={handleSubmit} className="create-group-form">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx} className='create-group-error'>{error}</li>
              ))}
            </ul>
            <div className="create-group-form-name">
              <label>Name:</label>
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
              <label>About:</label>
              <textarea
                rows='5'
                cols='20'
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
              <label>Type:</label>
              <select
                name='groupType'
                onChange={e => { setType(e.target.value); setShowTypeErrors(true) }}
                value={type}
                id="create-group-form-type-input"
              >
                <option value='' disabled>
                  Select a group type...
                </option>
                <option>Online</option>
                <option>In person</option>
              </select>
              <>
                {showTypeErrors && typeValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-private">
              <label>Private:</label>
              <select
                name='private'
                onChange={e => { setPrivateStatus(e.target.value); setShowPrivateErrors(true) }}
                value={privateStatus}
                id="create-group-form-private-input"
              >
                <option value='' disabled>
                  Select a private status...
                </option>
                <option>true</option>
                <option>false</option>
              </select>
              <>
                {showPrivateErrors && privateValidationErrors.map((error, idx) => (
                  <li key={idx} className='create-group-error'>{error}</li>
                ))}
              </>
            </div>
            <div className="create-group-form-city">
              <label>City:</label>
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
              <label>State:</label>
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
            <button disabled={!readyToSubmit} type="submit" className={readyToSubmit ? "create-group-form-submit-button" : "not-ready-to-create-group"} >Submit</button>
          </form>
        </div>
      </div>
    </div>
    );
};


export default CreateGroup;
