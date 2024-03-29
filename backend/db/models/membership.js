'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.Group, {foreignKey: 'groupId'});
      Membership.belongsTo(models.User, {foreignKey: 'memberId'});
    }
  }
  Membership.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull:false,

    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
