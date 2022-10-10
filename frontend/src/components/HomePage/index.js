import { useSelector } from "react-redux";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import './HomePage.css'


const HomePage= ({trigger, setTrigger}) => {
    const user = useSelector(state => state.session.user);
    const [image, setImage] = useState(null);

    const handle = (e) => {
        if (user) {
            setTrigger(true)
        } else {
            alert('Please log in.')
        }
    }



    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", image);
      csrfFetch('/api/images/upload', {
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData
      }).then((res) => res.json()).then((data) => console.log(data))

    };

    const updateFile = (e) => {
      const file = e.target.files[0];
      if (file) setImage(file);
    };



    return (<div>
      <div className="landing-backgroup-image-container">
        <img className="landing-backgroup-red" alt="red" src="https://secure.meetupstatic.com/next/images/blobs/red-blob.svg" />
        <img className="landing-backgroup-green" alt="green" src="https://secure.meetupstatic.com/next/images/blobs/green-blob.svg" />
        <img className="landing-backgroup-yellow" alt="yellow" src="https://secure.meetupstatic.com/next/images/blobs/yellow-blob.svg" />
      </div>
      <div className="landing-introduction">
        <div className="landing-introduction-left">
          <h1>Celebrating 20 years of real connections on Meetup</h1>
          <p>Whatever you're looking to do this year, Meetup can help. For 20 years, people have turned to Meetup to meet people, make friends, find support, grow a business, and explore their interests. Thousands of events are happening every day—join the fun.</p>
        </div>
        <div className="landing-introduction-right">
          <img className="landing-introduction-right-image" alt="landing-introduction-image" src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640" />
        </div>
      </div>
      <div className="landing-links">
      <form onSubmit={handleSubmit}>
        <label>Use AWS to Upload Image
          <input type="file" onChange={updateFile} />
        </label>
        <button type="submit">upload image</button>
      </form>
        <h2 className="landing-links-header">How Meetup works</h2>
        <div className="landing-links-para">
          <p>Meet new people who share your interests through online and in-person events. It’s free to create an account.</p>
        </div>
        <div className="landing-links-all-links">
          <div className="landing-links-all-groups">
            <img alt="landing-links-image1" src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384" />
            <NavLink className={"landing-links-navilink"} to='/allGroups' >Find a group</NavLink>
            <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
          </div>
          <div className="landing-links-all-events">
            <img alt="landing-links-image2" src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384" />
            <NavLink className={"landing-links-navilink"} to={'/allEvents'} >Find an Event</NavLink>
            <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
          </div>
          <div className="landing-links-create-group">
            <img alt="landing-links-image3" src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384" />
            <NavLink className={"landing-links-navilink"} to='/' onClick={handle} >Start a group</NavLink>
            <p>You don't have to be an expert to gather people together and explore shared interests.</p>
          </div>
        </div>
      </div>

    </div>)
}


export default HomePage;
