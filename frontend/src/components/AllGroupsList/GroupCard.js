import { useHistory } from "react-router-dom";
import './GroupCard.css'


const GroupCard = ({group}) => {
    const history = useHistory();

    if (!group) return null;
    if (!group.members) return null;

    return (
        <div className='groupcard-main' onClick={() => history.push(`/api/groups/${group.id}`)} >
            <div className='groupcard-left'>
                <div className='groupcard-image'>
                    <img className="image" alt="group preview image" src='https://res.cloudinary.com/zhihongliu/image/upload/v1658940429/cld-sample-4.jpg' />
                </div>
                <div className='groupcard-blank'>

                </div>

            </div>
            <div className='groupcard-right'>
                <div className="name-address">
                        <h3 className="name">{group.name}</h3>
                        <h3 className="address">{`${group.city}, ${group.state}`}</h3>
                </div>
                <div className="groupcard-about">
                    <p className="about">{group.about}</p>

                </div>
                <div className='groupcard-members-private'>
                    {`${Object.keys(group.members).length} members . ${group.private ? 'private' : 'public'}`}

                </div>

            </div>
        </div>
    )
}


export default GroupCard;
