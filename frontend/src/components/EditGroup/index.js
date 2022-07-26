import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateGroupThunk } from "../../store/groups";


const EditGroup = ({hiddenForm, groupId}) => {
    // const dispatch = useDispatch();
    // const history = useHistory();
    // const group = useSelector(state => state.groups[groupId]);

    // const [name, setName] = useState(group.name);
    // const [about, setAbout] = useState(group.about);
    // const [type, setType] = useState(group.type);
    // const [privateStatus, setPrivateStatus] = useState(group.private);
    // const [city, setCity] = useState(group.city);
    // const [state, setState] = useState(group.state);

    const handleSubmit = async (e) => {
        e.preventDefalut();
        console.log('I am here')
        // const newGroup = {
        //     name,
        //     about,
        //     type,
        //     private: privateStatus,
        //     city,
        //     state
        // };
        // // console.log(newGroup)
        // let updatedGroup;
        // try {
        //     updatedGroup = await dispatch(updateGroupThunk(newGroup));

        // } catch(error) {
        //     console.log(error);
        // }

        // if (updatedGroup) {
        //     history.push(`/api/groups/${updatedGroup.id}`);
        //     hiddenForm();
        // }
    }

    return (<form onSubmit={handleSubmit}>
        {/* <label>name:<input type={'text'} value={name} onChange={e => setName(e.target.value)}></input></label>
        <label>about:<input type={'text'} value={about} onChange={e => setAbout(e.target.value)}></input></label>
        <label>type:<input type={'text'} value={type} onChange={e => setType(e.target.value)}></input></label>
        <label>private:<input type={'boolean'} value={privateStatus} onChange={e => setPrivateStatus(e.target.value)}></input></label>
        <label>city:<input type={'text'} value={city} onChange={e => setCity(e.target.value)}></input></label>
        <label>state:<input type={'text'} value={state} onChange={e => setState(e.target.value)}></input></label> */}
        <button type="submit">Submit</button>
        <button onClick={hiddenForm}>Cancle</button>
    </form>

);
};


export default EditGroup;
