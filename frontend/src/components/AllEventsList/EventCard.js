import { useHistory } from "react-router-dom";
import './EventCard.css';


const EventCard = ({event}) => {
    const history = useHistory();

    const formattedDate = (date) => {
        const time = new Date(date);
        const DAYS = {0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT'};
        const MONTHS = {0: 'JAN', 1: 'FEB', 2: 'MAR', 3: 'APR', 4: 'MAY', 5: 'JUN', 6: 'JUL', 7: 'AUG', 8: 'SEP', 9: 'OCT', 10: 'NOV', 11: 'DEC'};
        const day = time.getDay();
        const month = time.getMonth();
        const year = time.getFullYear();
        let hour = time.getHours();
        const ampm = hour >=12 ? 'PM':'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;

        return `${DAYS[day]}, ${MONTHS[month]} ${year%100} . ${hour} ${ampm}`
    }

    return (
        <div className="event-card-container" onClick={() => history.push(`/api/events/${event.id}`)}>
            <div>
                <img className="event-card-image" alt="event image" src="https://res.cloudinary.com/zhihongliu/image/upload/v1658940428/cld-sample-2.jpg" />
                <div className="event-card-left-blank">
                </div>
            </div>
            <div className="event-card-right">
                <div>
                    <p className="event-card-start-date">{formattedDate(event.startDate)}</p>
                    <p className="event-card-name">{event.name}</p>
                    {event.Group ? <p className="event-card-group">{event.Group.name}.{event.Group.city},{event.Group.state}</p> : null}
                    <p className="event-card-attendee">{event.numAttending} {event.numAttending === 1 ? 'attendee' : 'attendees'}</p>
                </div>
            </div>
        </div>
    )
}


export default EventCard;
