import { useHistory } from "react-router-dom";
import './EventCard.css';


const EventCard = ({event}) => {
    const history = useHistory();

    return (
        <div className="event-card-container" onClick={() => history.push(`/api/events/${event.id}`)}>
            <div>
                <div>
                    <img className="event-card-image" alt="event image" src="https://res.cloudinary.com/zhihongliu/image/upload/v1658940428/cld-sample-2.jpg" />

                </div>
                <div className="event-card-left-blank">

                </div>
            </div>
            <div className="event-card-right">
                <div>
                    <p className="event-card-start-date">{event.startDate}</p>
                    <p className="event-card-name">{event.name}</p>
                    {event.Group ?<p className="event-card-group">{event.Group.name}.{event.Group.city},{event.Group.state}</p> : null}

                </div>
                <div>
                    <p></p>

                </div>

            </div>
        </div>
    )
}


export default EventCard;
