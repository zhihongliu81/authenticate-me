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
      previewImage: "image url1",
      },
      {
        organizerId: 2,
        name: "G2-Evening Tennis on the Water",
        about: "G2-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In person",
        private: true,
        city: "G2-New York",
        state: "NY",
        previewImage: "image url2",
        },
        {
          organizerId: 3,
          name: "G3-Evening Tennis on the Water",
          about: "G3-Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In person",
          private: true,
          city: "G3-New York",
          state: "NY",
          previewImage: "image url3",
          },
     ], {} )
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
       name: {[Op.in]: [
        "G1-Evening Tennis on the Water",
        "G2-Evening Tennis on the Water",
        "G3-Evening Tennis on the Water"
     ]}
     }, {})
  }
};



