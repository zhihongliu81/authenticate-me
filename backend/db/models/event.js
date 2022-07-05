'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User, {through: models.Attendee, foreignKey: 'eventId'});
      Event.belongsTo(models.Group, {foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'});
      Event.hasMany(models.Image, {foreignKey: 'eventId', onDelete: "CASCADE", hooks: true});
    }
  }
  Event.init({
    groupId: {
      type:  DataTypes.INTEGER,

    },
    venueId: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, ]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: ['Online', 'In person']
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        beInFuture(value) {
          const now = Date.now();
          const startTime = Date.parse(value);
          if (startTime <= now) {
            throw new Error("Start date must be in the future");
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        endDateAfterStartDate(value) {
          const startTime = Date.parse(this.startDate);
          const endTime = Date.parse(value);
          if (endTime <= startTime) {
            throw new Error("End date is less than start date")
          }
        }
      }
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
