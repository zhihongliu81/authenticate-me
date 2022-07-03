'use strict';

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
   await queryInterface.bulkInsert('Venues', [
    {
      groupId: 1,
      address: "111 Disney Lane",
      city: "New York",
      state:  "NY",
      lat: 11.1111111 ,
      lng: -111.1111111
    },
    {
      groupId: 2,
      address: "222 Disney Lane",
      city: "Houston",
      state: "TX",
      lat: 22.2222222,
      lng: -22.2222222
    },
    {
      groupId: 3,
      address: "333 Disney Lane",
      city: "Austin",
      state: "TX",
      lat: 33.3333333,
      lng: -33.3333333
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Venues', {
      [Op.or]: [
        {
          groupId: 1,
          address: "111 Disney Lane",
          city: "New York",
          state:  "NY",
          lat: 11.1111111 ,
          lng: -111.1111111
        },
        {
          groupId: 2,
          address: "222 Disney Lane",
          city: "Houston",
          state: "TX",
          lat: 22.2222222,
          lng: -22.2222222
        },
        {
          groupId: 3,
          address: "333 Disney Lane",
          city: "Austin",
          state: "TX",
          lat: 33.3333333,
          lng: -33.3333333
        }
      ]
    }, {})
  }
};
