const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Group, sequelize, Membership, Image, Event, Venue, Attendee } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



// Delete an image
router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
    const image = await Image.findByPk(req.params.imageId);
    if (!image) {
        res.statusCode = 404;
        return res.json({
            "message": "Image couldn't be found",
            "statusCode": 404
          })
    }

    if (image.groupId) {
        const group = await Group.findByPk(image.groupId);
        if (group.organizerId === req.user.id) {
            await image.destroy();
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        } else {
            res.statusCode = 403;
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
    }

    if (image.eventId) {
        const attendee = await Attendee.findOne({
            where: {
                eventId: image.eventId,
                userId: req.user.id
            }
        })

        if (attendee) {
            await image.destroy();
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        } else {
            res.statusCode = 403;
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
    }

})



module.exports = router;
