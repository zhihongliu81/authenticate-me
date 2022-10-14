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
     await queryInterface.bulkInsert("Groups",[
      {
        organizerId: 1,
        name: "G1-Evening Tennis on the Water",
        about: "G1-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In person",
        private: true,
        city: "G1-New York",
        state: "NY",
        previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780740676.jfif",
        },
        {
          organizerId: 2,
          name: "G2-Evening Tennis on the Water",
          about: "G2-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In person",
          private: true,
          city: "G2-New York",
          state: "NY",
          previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780778343.jpg",
          },
          {
            organizerId: 3,
            name: "G3-Evening Tennis on the Water",
            about: "G3-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
            type: "In person",
            private: true,
            city: "G3-New York",
            state: "NY",
            previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780800758.jpg",
            },
            {
              organizerId: 4,
              name: "Heart Of Texas Chorus",
              about: "The Heart Of Texas Chorus is an A Capella chorus that sings in the barbershop style. We welcome all men and women who love to sing! We meet Thursday nights at 7:00 pm at Fairfield Inn, 1250 IH 35 in San Marcos, Texas.",
              type: "In person",
              private: false,
              city: "San Marcos",
              state: "TX",
              previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780432638.jpg",
              },
              {
                organizerId: 5,
                name: "Austin Ladies' Coffee and Brunch",
                about: "Are you female? Do you like coffee? Do you like brunch? If so, then this is the group for you! Austin Ladies Coffee and Brunch is a way to connect with other women through food and community.",
                type: "In person",
                private: true,
                city: "Austin",
                state: "TX",
                previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780432638.jpg",
                },
                {
                  organizerId: 6,
                  name: "Pickup Soccer LA/OC",
                  about: "Friendly pickup games in LA that anyone can join through the Just Play app!",
                  type: "In person",
                  private: false,
                  city: "Los Angeles",
                  state: "CA",
                  previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780691084.jpg",
                  },
    ],
      {} )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
     await queryInterface.bulkDelete('Groups',{
      [Op.or]: [
        {
          organizerId: 1,
          name: "G1-Evening Tennis on the Water",
          about: "G1-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In person",
          private: true,
          city: "G1-New York",
          state: "NY",
          previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780740676.jfif",
          },
          {
            organizerId: 2,
            name: "G2-Evening Tennis on the Water",
            about: "G2-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
            type: "In person",
            private: true,
            city: "G2-New York",
            state: "NY",
            previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780778343.jpg",
            },
            {
              organizerId: 3,
              name: "G3-Evening Tennis on the Water",
              about: "G3-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
              type: "In person",
              private: true,
              city: "G3-New York",
              state: "NY",
              previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780800758.jpg",
              },
              {
                organizerId: 4,
                name: "Heart Of Texas Chorus",
                about: "The Heart Of Texas Chorus is an A Capella chorus that sings in the barbershop style. We welcome all men and women who love to sing! We meet Thursday nights at 7:00 pm at Fairfield Inn, 1250 IH 35 in San Marcos, Texas.",
                type: "In person",
                private: false,
                city: "San Marcos",
                state: "TX",
                previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780432638.jpg",
                },
                {
                  organizerId: 5,
                  name: "Austin Ladies' Coffee and Brunch",
                  about: "Are you female? Do you like coffee? Do you like brunch? If so, then this is the group for you! Austin Ladies Coffee and Brunch is a way to connect with other women through food and community.",
                  type: "In person",
                  private: true,
                  city: "Austin",
                  state: "TX",
                  previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780432638.jpg",
                  },
                  {
                    organizerId: 6,
                    name: "Pickup Soccer LA/OC",
                    about: "Friendly pickup games in LA that anyone can join through the Just Play app!",
                    type: "In person",
                    private: false,
                    city: "Los Angeles",
                    state: "CA",
                    previewImage: "https://zhihong-capstone.s3.amazonaws.com/1665780691084.jpg",
                    },
      ]
     }, {})
  }
};
