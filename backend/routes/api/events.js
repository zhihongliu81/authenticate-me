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

    res.json({Events: formattedEvents});
})


// Get details of an event specified by its id
router.get('/:eventId', async (req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
                model: User,
                attributes: ['id'],
                through: {
                    attributes: []
                }
            },
            {
                model: Image,
                attributes: ['url']
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'previewImage']
        }
    });

    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const images = [];
    for (let i = 0; i < event.Images.length; i++) {
        images.push(event.Images[i].url);
    }

    const formattedEvent = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            description: event.description,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            startDate: event.startDate,
            endDate: event.endDate,
            numAttending: event.Users.length,
            Group: event.Group,
            Venue: event.Venue,
            images
    };


    res.json(formattedEvent);
})





module.exports = router;
