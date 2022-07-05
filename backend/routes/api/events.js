const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image, Event, Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },
            {
                model: User,
                attributes: ['id']
            }
        ]
    });

    let formattedEvents = [];
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let formattedEvent = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            startDate: event.startDate,
            numAttending: event.Users.length,
            previewImage: event.previewImage,
            Group: event.Group,
            Venue: event.Venue
        };

        formattedEvents.push(formattedEvent);

    }


    res.json(formattedEvents);
})



module.exports = router;
