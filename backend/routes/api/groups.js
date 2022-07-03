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


module.exports = router;
