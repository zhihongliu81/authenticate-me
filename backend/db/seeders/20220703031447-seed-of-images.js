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
   await queryInterface.bulkInsert('Images', [
    {
      groupId: 1,
      eventId: null,
      url:"image url-group1"
    },
    {
      groupId: 2,
      eventId: null,
      url:"image url-group2"
    },
    {
      groupId: 3,
      eventId: null,
      url:"image url-group3"
    },
    {
      groupId: 1,
      eventId: null,
      url:"image url-group4"
    },
    {
      groupId: 2,
      eventId: null,
      url:"image url-group5"
    },
    {
      groupId: 3,
      eventId: null,
      url:"image url-group6"
    },
    {
      groupId: null,
      eventId: 1,
      url:"image url-event1"
    },
    {
      groupId: null,
      eventId: 2,
      url:"image url-event2"
    },
    {
      groupId: null,
      eventId: 3,
      url:"image url-event3"
    },
    {
      groupId: null,
      eventId: 1,
      url:"image url-event4"
    },
    {
      groupId: null,
      eventId: 2,
      url:"image url-event5"
    },
    {
      groupId: null,
      eventId: 3,
      url:"image url-event6"
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Images', {
      [Op.or]: [
        {
          groupId: 1,
          eventId: null,
          url:"image url-group1"
        },
        {
          groupId: 2,
          eventId: null,
          url:"image url-group2"
        },
        {
          groupId: 3,
          eventId: null,
          url:"image url-group3"
        },
        {
          groupId: 1,
          eventId: null,
          url:"image url-group4"
        },
        {
          groupId: 2,
          eventId: null,
          url:"image url-group5"
        },
        {
          groupId: 3,
          eventId: null,
          url:"image url-group6"
        },
        {
          groupId: null,
          eventId: 1,
          url:"image url-event1"
        },
        {
          groupId: null,
          eventId: 2,
          url:"image url-event2"
        },
        {
          groupId: null,
          eventId: 3,
          url:"image url-event3"
        },
        {
          groupId: null,
          eventId: 1,
          url:"image url-event4"
        },
        {
          groupId: null,
          eventId: 2,
          url:"image url-event5"
        },
        {
          groupId: null,
          eventId: 3,
          url:"image url-event6"
        },
      ]
    }, {})
  }
};
