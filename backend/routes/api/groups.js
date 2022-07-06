const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image, Event, Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        include: {
            model: User,
        }
    });
    let formattedGroups = [];
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let numMembers = group.Users.length;
        let formattedGroup = {
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers,
            previewImage: group.previewImage
        };
        formattedGroups.push(formattedGroup);
    }
    res.json({Groups: formattedGroups});


})


// Get all Groups by the current user
router.get('/current', restoreUser, requireAuth, async (req, res) => {

    const groups = await Group.findAll({
        include: {
            model: User
        },
    });
    let formattedGroups = [];
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let numMembers = group.Users.length;
        for (let j = 0; j < numMembers; j++) {
            let member = group.Users[j];
            if (member.id === req.user.id) {
                let formattedGroup = {
                    id: group.id,
                    organizerId: group.organizerId,
                    name: group.name,
                    about: group.about,
                    type: group.type,
                    private: group.private,
                    city: group.city,
                    state: group.state,
                    createdAt: group.createdAt,
                    updatedAt: group.updatedAt,
                    numMembers,
                    previewImage: group.previewImage
                };
                formattedGroups.push(formattedGroup);
            }
        }
    }
    res.json({Groups: formattedGroups});
})

// Get details of a group by id
router.get('/:groupId', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
              model: User,
            },
            {
              model: Image,
              attributes: ['url']
            }
        ]
    });
    if (!group) {
        res.statusCode = 404;
       return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    }
    let images = [];
    for (let i = 0; i < group.Images.length; i++) {
        let ele = group.Images[i];
        images.push(ele.url);
    }
    const organizer = await User.findByPk(group.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })
    let formattedGroup = {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: group.Users.length,
        images,
        Organizer: organizer
    };
    res.json(formattedGroup);
})

// Create a Group
const validateGroup = [
    check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage( "Name must be 60 characters or less"),
    check('about')
    .exists({checkFalsy: true})
    .isLength({min: 50})
    .withMessage("About must be 50 characters or more"),
    check('type')
    .exists({checkFalsy: true})
    .isIn(['Online', 'In person'])
    .withMessage("Type must be Online or In person"),
    check('private')
    .exists({checkFalsy: true})
    .isBoolean()
    .withMessage("Private must be a boolean"),
    check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
    check('state')
    .exists({checkFalsy: true})
    .withMessage("State is required"),
    handleValidationErrors
]
router.post('/', restoreUser, requireAuth, validateGroup, async (req, res) => {
    const {name, about, type, private, city, state} = req.body;
    const group = await Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state,
    });
    const membership = await Membership.create({
        groupId: group.id,
        memberId: req.user.id,
        status: 'organizer'
    })
    res.statusCode = 201;
    res.json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private:group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    });
})

// Edit a group
router.put('/:groupId', restoreUser, requireAuth, validateGroup, async (req, res) => {

    let group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
    if (req.user.id !== group.organizerId) {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          });
    }
    await group.update({
        ...req.body
    })
    group = await Group.findByPk(req.params.groupId, {
        attributes: {
            exclude: ['previewImage']
        }
    });
    res.json(group);
})

// Delete a group
router.delete('/:groupId', restoreUser, requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    }
    if (group.organizerId !== req.user.id) {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

    await group.destroy();

    res.statusCode = 200;
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      });
})


// Get all members of a group specified by its id
router.get('/:groupId/members', restoreUser, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    }

    const members = await Membership.findAll({
        where: {
            groupId: req.params.groupId
        },
        include: {
            model: User
        }
    });

    const formattedMembers = [];
    if (!req.user || group.organizerId !== req.user.id) {
        members.forEach(member => {
            let memberObj = {};
            memberObj.id = member.memberId;
            memberObj.firstName = member.User.firstName;
            memberObj.lastName = member.User.lastName;
            memberObj.Membership = {status: member.status};
            if (member.status !== 'pending') {
                formattedMembers.push(memberObj);
            }
        })
    } else {
            members.forEach(member => {
            let memberObj = {};
            memberObj.id = member.memberId;
            memberObj.firstName = member.User.firstName;
            memberObj.lastName = member.User.lastName;
            memberObj.Membership = {status: member.status};
            formattedMembers.push(memberObj);
        })
    }

    res.json({Members:formattedMembers});
})


// Request a Membership for a group based on the group's id
router.post('/:groupId/register', restoreUser, requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
       return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    }

    let membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.user.id
        }
    })

    if (membership) {
        if (membership.status === "pending") {
            res.statusCode = 400;
            return res.json({
                "message": "Membership has already been requested",
                "statusCode": 400
              })
        } else {
            res.statusCode = 400;
            return res.json({
                "message": "User is already a member of the group",
                "statusCode": 400
              })
        }
    }
//    await Membership.create({
//         groupId: req.params.groupId,
//         memberId: req.user.id,
//         status: "pending"
//     })
       membership = Membership.build({
        groupId: req.params.groupId,
        memberId: req.user.id,
        status: "pending"
       });
       await membership.save();
    membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.user.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    res.json(membership);
})


// change the status of a membership for a group specified by id
router.patch('/:groupId/membership', restoreUser, requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
    const membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.body.memberId
        },
        attributes: {
            include: ['id', 'groupId', 'memberId', 'status'],
            exclude: ['createdAt', 'updatedAt']
        }
    });

    if(!membership) {
        res.statusCode = 404;
        return res.json({
            "message": "Membership between the user and the group does not exits",
            "statusCode": 404
          })
    }

    if (req.body.status === 'pending') {
        res.statusCode = 400;
        return res.json({
            "message": "Cannot change a membership status to pending",
            "statusCode": 400
          })
    };
    let currentUserMembership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.user.id
        }
    });

    if (!currentUserMembership) {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    };
    const status = currentUserMembership.toJSON().status;
    if (req.body.status === 'member' && (status !== 'organizer' && status !== 'co-host')) {
        res.statusCode = 403;
        return res.json({
            "message": "Current User must be the organizer or a co-host to make someone a member",
            "statusCode": 403
          })
    }

    if (req.body.status === 'co-host' && status !== 'organizer') {
        res.statusCode = 403;
        return res.json({
            "message": "Current User must be the organizer to add a co-host",
            "statusCode": 403
          })
    }

    // const newMembership = await membership.update({
    //     status: req.body.status
    // })

    // res.json(newMembership);
    membership.status = req.body.status;

    await membership.save();

    res.json({
        id: membership.id,
        groupId: membership.groupId,
        memberId: membership.memberId,
        status: membership.status
    });
})

// Delete membership to a group specified by id
router.delete('/:groupId/membership/membershipId', restoreUser, requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    };

    const membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.body.memberId
        }
    });
    if (!membership) {
        res.statusCode = 404;
        return res.json({
            "message": "Membership does not exist for this User",
            "statusCode": 404
          })
    };

    if (req.user.id === group.organizerId || req.user.id === req.body.memberId) {
        await membership.destroy();
        return res.json({
            "message": "Successfully deleted membership from group"
          })
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Only the User or organizer may delete a Membership",
            "statusCode": 403
          })
    }

})


// Get all events of a group specified by its id
router.get('/:groupId/events', async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }

    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
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

    res.json({Events:formattedEvents})

})


const validateVenue = [
    check('address')
    .exists({ checkFalsy: true })
    .withMessage( "Street address is required" ),
    check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
    check('state')
    .exists({checkFalsy: true})
    .withMessage("State is required"),
    check('lat')
    .exists({checkFalsy: true})
    .isFloat({min: -90, max: 90})
    .withMessage( "Latitude is not valid"),
    check('lng')
    .exists({checkFalsy: true})
    .isFloat({min: -180, max: 180})
    .withMessage( "Longitude is not valid"),
    handleValidationErrors
]
// Create a new Venue for a group specified by its id
router.post('/:groupId/venues/new', restoreUser, requireAuth, validateVenue, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    };

    const membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId,
            memberId: req.user.id
        }
    })

    if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
        const newVenue = await Venue.create({
            groupId: req.params.groupId,
            ...req.body
        });
        const {id, groupId, address, city, state, lat, lng} = newVenue;

        return res.json({id, groupId, address, city, state, lat, lng});
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
})


// Create an Event for a group specified by its id
const validateEvent = [
    check('venueId')
    .exists({ checkFalsy: true })
    .custom(async (value, {req}) => {
        const venue = await Venue.findByPk(value);
        if (!venue) {
            throw new Error("Venue does not exist")
        }
        return true;
    })
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
router.post('/:groupId/events/new', restoreUser, requireAuth, validateEvent, async (req, res) => {

    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          })
    }
    const membership = await Membership.findOne({
        where: {
            memberId: req.user.id,
            groupId: req.params.groupId
        }
    })

    if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
        const event = await Event.create({
            groupId: req.params.groupId,
            ...req.body
        })
        const formattedEvent = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        }

        res.json(formattedEvent)
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }



} )



module.exports = router;
