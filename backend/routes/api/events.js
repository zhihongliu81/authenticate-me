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


// Edit an event specified by its id
const validateEvent = [
    check('venueId')
    .exists({ checkFalsy: true })
    .withMessage( "Venue does not exist" ),
    check('name')
    .exists({checkFalsy: true})
    .isLength({min: 5})
    .withMessage("Name must be at least 5 characters"),
    check('type')
    .exists({checkFalsy: true})
    .isIn(['Online', 'In person'])
    .withMessage("Type must be Online or In person"),
    check('capacity')
    .exists({checkFalsy: true})
    .isInt()
    .withMessage( "Capacity must be an integer"),
    check('price')
    .exists({checkFalsy: true})
    .isFloat()
    .withMessage( "Price is invalid"),
    check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
    check('startDate')
    .isISO8601()
    .isAfter()
    .withMessage("Start date must be in the future"),
    check('endDate')
    .isISO8601()
    .custom((value, {req}) => {
        const startTime = Date.parse(req.body.startDate);
        const endTime = Date.parse(value);
        if (endTime <= startTime) {
            throw new Error("End date is less than start date")
        }
        return true;
    })
    .withMessage("End date is less than start date"),
    handleValidationErrors
]
router.put('/:eventId', restoreUser, requireAuth, validateEvent, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const venue = await Venue.findByPk(req.body.venueId);
    if (!venue) {
        res.statusCode = 404;
        return res.json({
            "message": "Venue couldn't be found",
            "statusCode": 404
          })
    }

    const membership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            memberId: req.user.id
        }
    })
    if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
        const newEvent = await event.update({
            ...req.body
        })
        const formattedEvent = {
            id: newEvent.id,
            groupId: newEvent.groupId,
            venueId: newEvent.venueId,
            name: newEvent.name,
            type: newEvent.type,
            capacity: newEvent.capacity,
            price: newEvent.price,
            description: newEvent.description,
            startDate: newEvent.startDate,
            endDate: newEvent.endDate
        }

        res.json(formattedEvent);
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

})


module.exports = router;
