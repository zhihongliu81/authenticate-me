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
   await queryInterface.bulkInsert('Attendees', [
    {
      eventId: 1,
      userId: 1,
      status: "member"
    },
    {
      eventId: 1,
      userId: 2,
      status: "pending"
    },
    {
      eventId: 1,
      userId: 3,
      status: "member"
    },
    {
      eventId: 1,
      userId: 4,
      status: "waitlist"
    },
    {
      eventId: 2,
      userId: 5,
      status: "pending"
    },
    {
      eventId: 2,
      userId: 6,
      status: "member"
    },
    {
      eventId: 2,
      userId: 7,
      status: "member"
    },
    {
      eventId: 3,
      userId: 8,
      status: "member"
    },
    {
      eventId: 3,
      userId: 9,
      status: "member"
    },
    {
      eventId: 4,
      userId: 1,
      status: "member"
    }, {
      eventId: 4,
      userId: 2,
      status: "member"
    }, {
      eventId: 4,
      userId: 3,
      status: "member"
    }, {
      eventId: 5,
      userId: 4,
      status: "member"
    }, {
      eventId: 5,
      userId: 5,
      status: "member"
    }, {
      eventId: 6,
      userId: 6,
      status: "member"
    }, {
      eventId: 6,
      userId: 7,
      status: "member"
    }, {
      eventId: 7,
      userId: 8,
      status: "member"
    }, {
      eventId: 7,
      userId: 9,
      status: "member"
    }, {
      eventId: 8,
      userId: 10,
      status: "member"
    }, {
      eventId: 8,
      userId: 1,
      status: "member"
    }, {
      eventId: 9,
      userId: 2,
      status: "member"
    }, {
      eventId: 9,
      userId: 3,
      status: "member"
    }, {
      eventId: 9,
      userId: 4,
      status: "member"
    }, {
      eventId: 10,
      userId: 5,
      status: "member"
    }, {
      eventId: 11,
      userId: 6,
      status: "member"
    }, {
      eventId: 12,
      userId: 7,
      status: "member"
    }, {
      eventId: 13,
      userId: 8,
      status: "member"
    }, {
      eventId: 13,
      userId: 9,
      status: "member"
    }, {
      eventId: 14,
      userId: 10,
      status: "member"
    }, {
      eventId: 14,
      userId: 1,
      status: "member"
    }, {
      eventId: 14,
      userId: 2,
      status: "member"
    }, {
      eventId: 14,
      userId: 3,
      status: "member"
    }, {
      eventId: 14,
      userId: 4,
      status: "member"
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
    await queryInterface.bulkDelete('Attendees', {
      [Op.or]: [
        {
          eventId: 1,
          userId: 1,
          status: "member"
        },
        {
          eventId: 1,
          userId: 2,
          status: "pending"
        },
        {
          eventId: 1,
          userId: 3,
          status: "member"
        },
        {
          eventId: 1,
          userId: 4,
          status: "waitlist"
        },
        {
          eventId: 2,
          userId: 5,
          status: "pending"
        },
        {
          eventId: 2,
          userId: 6,
          status: "member"
        },
        {
          eventId: 2,
          userId: 7,
          status: "member"
        },
        {
          eventId: 3,
          userId: 8,
          status: "member"
        },
        {
          eventId: 3,
          userId: 9,
          status: "member"
        },
        {
          eventId: 4,
          userId: 1,
          status: "member"
        }, {
          eventId: 4,
          userId: 2,
          status: "member"
        }, {
          eventId: 4,
          userId: 3,
          status: "member"
        }, {
          eventId: 5,
          userId: 4,
          status: "member"
        }, {
          eventId: 5,
          userId: 5,
          status: "member"
        }, {
          eventId: 6,
          userId: 6,
          status: "member"
        }, {
          eventId: 6,
          userId: 7,
          status: "member"
        }, {
          eventId: 7,
          userId: 8,
          status: "member"
        }, {
          eventId: 7,
          userId: 9,
          status: "member"
        }, {
          eventId: 8,
          userId: 10,
          status: "member"
        }, {
          eventId: 8,
          userId: 1,
          status: "member"
        }, {
          eventId: 9,
          userId: 2,
          status: "member"
        }, {
          eventId: 9,
          userId: 3,
          status: "member"
        }, {
          eventId: 9,
          userId: 4,
          status: "member"
        }, {
          eventId: 10,
          userId: 5,
          status: "member"
        }, {
          eventId: 11,
          userId: 6,
          status: "member"
        }, {
          eventId: 12,
          userId: 7,
          status: "member"
        }, {
          eventId: 13,
          userId: 8,
          status: "member"
        }, {
          eventId: 13,
          userId: 9,
          status: "member"
        }, {
          eventId: 14,
          userId: 10,
          status: "member"
        }, {
          eventId: 14,
          userId: 1,
          status: "member"
        }, {
          eventId: 14,
          userId: 2,
          status: "member"
        }, {
          eventId: 14,
          userId: 3,
          status: "member"
        }, {
          eventId: 14,
          userId: 4,
          status: "member"
        },
       ]
    }, {})
  }
};
