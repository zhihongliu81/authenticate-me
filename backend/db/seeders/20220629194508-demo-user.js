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
      email: "john.smith@gmail.com",
      firstName: "John",
      lastName: "Smith",
      hashedPassword: bcrypt.hashSync('secret password')
    },
    {
      email: 'user1@user.io',
      // username: 'FakeUser1',
      firstName: 'James',
      lastName: 'Brown',
      hashedPassword: bcrypt.hashSync('password1')
    },
    {
      email: 'user2@user.io',
      // username: 'FakeUser2',
      firstName: 'Mary',
      lastName: 'Jones',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'user3@user.io',
      // username: 'FakeUser3',
      firstName: 'Robert',
      lastName: 'Miller',
      hashedPassword: bcrypt.hashSync('password3')
    },
    {
      email: 'user4@user.io',
      // username: 'FakeUser4',
      firstName: 'Jennifer',
      lastName: 'Davis',
      hashedPassword: bcrypt.hashSync('password4')
    },
    {
      email: 'user5@user.io',
      // username: 'FakeUser5',
      firstName: 'Michael',
      lastName: 'Garcia',
      hashedPassword: bcrypt.hashSync('password5')
    },
    {
      email: 'user6@user.io',
      // username: 'FakeUser6',
      firstName: 'Linda',
      lastName: 'Wilson',
      hashedPassword: bcrypt.hashSync('password6')
    },
    {
      email: 'user7@user.io',
      // username: 'FakeUser7',
      firstName: 'David',
      lastName: 'Anderson',
      hashedPassword: bcrypt.hashSync('password7')
    },
    {
      email: 'user8@user.io',
      // username: 'FakeUser8',
      firstName: 'Elizabeth',
      lastName: 'Taylor',
      hashedPassword: bcrypt.hashSync('password8')
    },
    {
      email: 'user9@user.io',
      // username: 'FakeUser9',
      firstName: 'William',
      lastName: 'Thomas',
      hashedPassword: bcrypt.hashSync('password9')
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
      email: {[Op.in]: [
        'user1@user.io', 'user2@user.io', 'user3@user.io',
        'user4@user.io', 'user5@user.io', 'user6@user.io',
        'user7@user.io', 'user8@user.io', 'user9@user.io',
        'john.smith@gmail.com'
    ]}
    }, {})
  }
};
