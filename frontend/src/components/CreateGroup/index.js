import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { newGroupThunk } from "../../store/groups";



const CreateGroup = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privateStatus, setPrivateStatus] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const handleSumbit = async (e) => {
        e.preventDefault();

        const newGroup = {
            name,
            about,
            type,
            private: privateStatus,
            city,
            state
        };
        let createdNewGroup;
        try {
            createdNewGroup = await dispatch(newGroupThunk(newGroup));

        } catch (error) {
            console.log(error);
        }

        if (createdNewGroup) {
            history.push(`/api/groups/${createdNewGroup.id}`);
            // hiddenForm();
        }

    };


    return (
        <div>{`Create New Group:`}
            <form onSubmit={handleSumbit}>
                <label>name:<input type={'text'} value={name} onChange={e => setName(e.target.value)}></input></label>
                <label>about:<input type={'text'} value={about} onChange={e => setAbout(e.target.value)}></input></label>
                <label>type:<input type={'text'} value={type} onChange={e => setType(e.target.value)}></input></label>
                <label>private:<input type={'boolean'} value={privateStatus} onChange={e => setPrivateStatus(e.target.value)}></input></label>


                <label>city:<input type={'text'} value={city} onChange={e => setCity(e.target.value)}></input></label>
                <label>state:<input type={'text'} value={state} onChange={e => setState(e.target.value)}></input></label>
                <button type="sumbit" >Sumbit</button>
                {/* <button onClick={hiddenForm}>Cancle</button> */}
            </form>

        </div>
    );
};


export default CreateGroup;
