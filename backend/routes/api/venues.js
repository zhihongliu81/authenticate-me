const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image, Event, Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Edit a venue specified by its id
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
router.put('/:venueId', restoreUser, requireAuth, validateVenue, async (req, res) => {
    const venue = await Venue.findByPk(req.params.venueId);
    if (!venue) {
        res.statusCode = 404;
        return res.json({
            "message": "Venue couldn't be found",
            "statusCode": 404
          })
    };

    const membership = await Membership.findOne({
        where: {
            groupId: venue.groupId,
            memberId: req.user.id
        }
    })

    if (membership && (membership.status === 'organizer' || membership.status === 'co-host') ) {
        const newVenue = await venue.update({
            ...req.body
        })
        const {id, groupId, address, city, state, lat, lng} = newVenue

        return res.json({id, groupId, address, city, state, lat, lng});
    } else {
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

})

module.exports = router;
