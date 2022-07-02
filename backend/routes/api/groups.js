const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize } = require('../../db/models');
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



module.exports = router;
