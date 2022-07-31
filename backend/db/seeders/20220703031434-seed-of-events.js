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
   await queryInterface.bulkInsert('Events', [
    {
      groupId: 1,
      venueId: 1,
      name: "Tennis Group First Meet and Greet",
      description: "The first meet and greet for our group! Come say hello!",
      type: "Online",
      capacity: 20,
      price: 10.00,
      startDate: "2021-11-19 20:00:00",
      endDate:  "2021-11-19 21:00:00",
      previewImage: "image url-event1",
    },
    {
      groupId: 2,
      venueId: 2,
      name: "Event-2: Tennis Group First Meet and Greet",
      description: "Event-2: The first meet and greet for our group! Come say hello!",
      type: "In person",
      capacity: 20,
      price: 10.00,
      startDate: "2021-11-19 20:00:00",
      endDate:  "2021-11-19 21:00:00",
      previewImage: "image url-event2",
    },
    {
      groupId: 3,
      venueId: 3,
      name: "Event-3: Tennis Group First Meet and Greet",
      description: "Event-3: The first meet and greet for our group! Come say hello!",
      type: "Online",
      capacity: 20,
      price: 10.00,
      startDate: "2021-11-19 20:00:00",
      endDate:  "2021-11-19 21:00:00",
      previewImage: "image url-event3",
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
     const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Events', {
      [Op.or]: [
        {
          groupId: 1,
          venueId: 1,
          name: "Tennis Group First Meet and Greet",
          description: "The first meet and greet for our group! Come say hello!",
          type: "Online",
          capacity: 20,
          price: 10.00,
          startDate: "2021-11-19 20:00:00",
          endDate:  "2021-11-19 21:00:00",
          previewImage: "image url-event1",
        },
        {
          groupId: 2,
          venueId: 2,
          name: "Event-2: Tennis Group First Meet and Greet",
          description: "Event-2: The first meet and greet for our group! Come say hello!",
          type: "In person",
          capacity: 20,
          price: 10.00,
          startDate: "2021-11-19 20:00:00",
          endDate:  "2021-11-19 21:00:00",
          previewImage: "image url-event2",
        },
        {
          groupId: 3,
          venueId: 3,
          name: "Event-3: Tennis Group First Meet and Greet",
          description: "Event-3: The first meet and greet for our group! Come say hello!",
          type: "Online",
          capacity: 20,
          price: 10.00,
          startDate: "2021-11-19 20:00:00",
          endDate:  "2021-11-19 21:00:00",
          previewImage: "image url-event3",
        }
      ]
    }, {})
  }
};
