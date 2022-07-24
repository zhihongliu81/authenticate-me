import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupDetailsThunk } from "../../store/groups";


const GroupDetails = () => {
    const {groupId} = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);

    useEffect(() => {
        dispatch(groupDetailsThunk(groupId));

    }, [dispatch]);

    return (
        <div>{`Group ${groupId}: `}

        </div>
    )

}


export default GroupDetails;
