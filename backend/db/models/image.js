'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Group);
      // Image.belongsTo(models.Event, {foreignKey: 'eventId'});
    }
  }
  Image.init({
    groupId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: 'Groups'
      // }

    },
    eventId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: 'Events'
      // }

    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
