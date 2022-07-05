'use strict';
const {
  Model, Validator
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const {id, firstName, lastName, email} = this; //context will be the User instance
      return {id, firstName, lastName, email};
    };

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    };

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    };

    static async login({email, password}) {
      const { Op} = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          // [Op.or]: {
          //   username: credential,
          //   email: credential
          // }
          email: email
        }
      });
      if(user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    };

    static async signup({firstName, lastName, email, password}) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Group, { through: models.Membership, foreignKey: 'memberId'});
      User.belongsToMany(models.Event, {through: models.Attendee, foreignKey: 'userId'});
    }
  }
  User.init({
    // username: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    //   validate: {
    //     len: [4, 30],
    //     isNotEmail(value) {
    //       if (Validator.isEmail(value)) {
    //         throw new Error("Cannot be an email.");
    //       }
    //     }
    //   }

    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256]
      }

    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'updatedAt', 'email', 'createdAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ["hashedPassword", 'updatedAt','createdAt'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  return User;
};
