const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image, Event, Venue, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all events
// router.get('/', async (req, res) => {
//     const events = await Event.findAll({
//         include: [
//             {
//                 model: Group,
//                 attributes: ['id', 'name', 'city', 'state']
//             },
//             {
//                 model: Venue,
//                 attributes: ['id', 'city', 'state']
//             },
//             {
//                 model: User,
//                 attributes: ['id']
//             }
//         ]
//     });

//     let formattedEvents = [];
//     for (let i = 0; i < events.length; i++) {
//         let event = events[i];
//         let formattedEvent = {
//             id: event.id,
//             groupId: event.groupId,
//             venueId: event.venueId,
//             name: event.name,
//             type: event.type,
//             startDate: event.startDate,
//             numAttending: event.Users.length,
//             previewImage: event.previewImage,
//             Group: event.Group,
//             Venue: event.Venue
//         };

//         formattedEvents.push(formattedEvent);

//     }

//     res.json({Events: formattedEvents});
// })


// get all events with query
const validateQuery = [
    check('page')
    .if(check('page').exists())
    .isInt({min: 0})
    .withMessage( "Page must be greater than or equal to 0" ),
    check('size')
    .if(check('size').exists())
    .isInt({min: 0})
    .withMessage("Size must be greater than or equal to 0"),
    check('name')
    .if(check('name').exists())
    .isString()
    .withMessage("Name must be a string"),
    check('type')
    .if(check('type').exists())
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In Person'"),
    check('startDate')
    .if(check('startDate').exists())
    .isISO8601()
    .withMessage("Start date must be a valid datetime"),

    handleValidationErrors
]

router.get('/', validateQuery, async (req, res) => {
    let {page, size, name, type, startDate} = req.query;
    const where = {};
    if (name) {
        where.name = name;
    }
    if (type) {
        where.type = type;
    }
    if (startDate) {
        where.startDate = startDate
    }

    const pagination = {};
    if (page) {
        page = Number(page);
        if (page > 11) {
            page = 11;
        }
    } else {
        page = 1
    }
    if (size) {
        size = Number(size);
        if (size > 20) {
            size = 20
        }
    } else {
        size = 20
    }
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    const events = await Event.findAll({
        where,
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
                    ],
        ...pagination

    })

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


// Delete an event specified by its id
router.delete('/:eventId', restoreUser, requireAuth, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
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
        await event.destroy();
        res.json({
            "message": "Successfully deleted"
          })
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

})


// Get all attendees of an Event specified by its id
router.get('/:eventId/attendees', restoreUser, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    let attendees = await Attendee.findAll({
        where: {
            eventId: req.params.eventId
        },
        include: {
            model: User
        }
    });

    const formattedAttendees = [];

    if (req.user) {
        const membership = await Membership.findOne({
            where: {
                groupId: event.groupId,
                memberId: req.user.id
            }
        });
        if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
            for (let i = 0; i < attendees.length; i++) {
                let attendee = attendees[i].toJSON();

                    let formattedAttendee = {
                        ...attendee.User,
                        Attendance: {
                            status: attendee.status
                        }
                    };
                    formattedAttendees.push(formattedAttendee)
            }
        } else {
            for (let i = 0; i < attendees.length; i++) {
                let attendee = attendees[i].toJSON();
                if (attendee.status !== 'pending') {
                    let formattedAttendee = {
                        ...attendee.User,
                        Attendance: {
                            status: attendee.status
                        }
                    };
                    formattedAttendees.push(formattedAttendee)
                }
            }
        }
    } else {
        for (let i = 0; i < attendees.length; i++) {
            let attendee = attendees[i].toJSON();
            if (attendee.status !== 'pending') {
                let formattedAttendee = {
                    ...attendee.User,
                    Attendance: {
                        status: attendee.status
                    }
                };
                formattedAttendees.push(formattedAttendee)
            }
        }
    }

    res.json({Attendees: formattedAttendees})
})


// Request to attend an event based on the event's id
router.post('/:eventId/register', restoreUser, requireAuth, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const membership = await Membership.findOne({
        where: {
            memberId: req.user.id,
            groupId: event.groupId
        }
    });

    if (membership && membership !== 'pending') {
        const attendee = await Attendee.findOne({
            where: {
                eventId: req.params.eventId,
                userId: req.user.id
            }

        });

        if (!attendee) {
            const newAttendee = await Attendee.create({
                eventId: req.params.eventId,
                userId: req.user.id,
                status: 'pending'
            });

            res.json({
                eventId: newAttendee.eventId,
                userId: newAttendee.userId,
                status: newAttendee.status
            });
        } else {
            if (attendee.status === 'pending') {
                res.statusCode = 400;
                return res.json({
                    "message": "Attendance has already been requested",
                    "statusCode": 400
                  })
            } else {
                res.statusCode = 400;
                return res.json({
                    "message": "User is already an attendee of the event",
                    "statusCode": 400
                  })
            }
        }

    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
} )


// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendees/update', restoreUser, requireAuth, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const attendee = await Attendee.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.body.userId
        }
    });
    if (!attendee) {
        res.statusCode = 404;
        return res.json({
            "message": "Attendance between the user and the event does not exist",
            "statusCode": 404
          })
    }

    if (req.body.status === 'pending') {
        res.statusCode = 400;
        return res.json({
            "message": "Cannot change an attendance status to pending",
            "statusCode": 400
          })
    }

    const membership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            memberId: req.user.id
        }
    })
    if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
        await attendee.update({
            status: req.body.status
        });
        const newAttendee = await Attendee.findOne({
            where: {
                eventId: req.params.eventId,
                userId: req.body.userId
            },
            attributes:['id', 'eventId', 'userId', 'status']
        })
        res.json(newAttendee);
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

})


// Delete attendance to an event specified by id
router.delete('/:eventId/attendees/attendeeId', restoreUser, requireAuth, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        include: [
            {
                model: Group
            }
        ]
    })

    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const attendee = await Attendee.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.body.userId
        }
    })
    if (!attendee) {
        res.statusCode = 404;
        return res.json({
            "message": "Attendance does not exist for this User",
            "statusCode": 404
          })
    }

    if (req.user.id === req.body.userId || req.user.id === event.Group.organizerId) {
        await attendee.destroy();
        res.json({
            "message": "Successfully deleted attendance from event"
          })
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Only the User or organizer may delete an Attendance",
            "statusCode": 403
          })
    }

} )


// Add an image to an event based on the event's id
router.post('/:eventId/images', restoreUser, requireAuth, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

    const attendee = await Attendee.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id
        }
    })
    if (attendee) {
        const newImage = await Image.create({
            eventId: req.params.eventId,
            url: req.body.url
        })
        res.json({
            id: newImage.id,
            imageableId: newImage.eventId,
            imageableType: 'Event',
            url: newImage.url
        })
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
})








module.exports = router;
