'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', [
    {
      email: 'demo@user.io',
      // username: 'Demo-lition',
      firstName: 'Demo',
      lastName: 'Lition',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      email: 'user1@user.io',
      // username: 'FakeUser1',
      firstName: 'firstName1',
      lastName: 'lastName1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'user2@user.io',
      // username: 'FakeUser2',
      firstName: 'firstName2',
      lastName: 'lastName2',
      hashedPassword: bcrypt.hashSync('password3')
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Users',{
      email: {[Op.in]: ['demo@user.io', 'user1@user.io', 'user2@user.io']}
    }, {})
  }
};
