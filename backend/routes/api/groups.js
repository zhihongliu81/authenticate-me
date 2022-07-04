const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image } = require('../../db/models');
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
    res.json({groups: formattedGroups});


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
    res.json(group);
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

    res.json(formattedMembers);
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
        }
    })
    res.json(membership);
})


module.exports = router;
