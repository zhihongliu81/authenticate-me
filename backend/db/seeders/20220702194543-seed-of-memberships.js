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

     await queryInterface.bulkInsert('Memberships',[
       { groupId: 1, memberId: 1, status: 'organizer' },
       { groupId: 1, memberId: 4, status: 'co-host' },
       { groupId: 1, memberId: 7, status: 'member' },
       { groupId: 1, memberId: 2, status: 'pending' },
       { groupId: 2, memberId: 2, status: 'organizer' },
       { groupId: 2, memberId: 5, status: 'co-host' },
       { groupId: 2, memberId: 8, status: 'member' },
       { groupId: 2, memberId: 1, status: 'member' },
       { groupId: 2, memberId: 9, status: 'pending' },
       { groupId: 3, memberId: 3, status: 'organizer' },
       { groupId: 3, memberId: 6, status: 'co-host' },
       { groupId: 3, memberId: 9, status: 'member' },
       { groupId: 3, memberId: 1, status: 'member' },
       { groupId: 3, memberId: 5, status: 'pending' },
       { groupId: 4, memberId: 4, status: 'organizer' },
       { groupId: 4, memberId: 1, status: 'co-host' },
       { groupId: 4, memberId: 10, status: 'member' },
       { groupId: 4, memberId: 7, status: 'member' },
       { groupId: 4, memberId: 2, status: 'pending' },
       { groupId: 5, memberId: 5, status: 'organizer' },
       { groupId: 5, memberId: 2, status: 'member' },
       { groupId: 5, memberId: 9, status: 'member' },
       { groupId: 5, memberId: 1, status: 'pending' },
       { groupId: 5, memberId: 6, status: 'pending' },
       { groupId: 6, memberId: 6, status: 'organizer' },
       { groupId: 6, memberId: 10, status: 'member' },
       { groupId: 6, memberId: 4, status: 'member' },
       { groupId: 6, memberId: 7, status: 'member' },
       { groupId: 6, memberId: 2, status: 'pending' },
       { groupId: 6, memberId: 3, status: 'pending' },
     ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     const Op = Sequelize.Op;
     await queryInterface.bulkDelete('Memberships',{
       [Op.or]: [
        { groupId: 1, memberId: 1, status: 'organizer' },
        { groupId: 1, memberId: 4, status: 'co-host' },
        { groupId: 1, memberId: 7, status: 'member' },
        { groupId: 1, memberId: 2, status: 'pending' },
        { groupId: 2, memberId: 2, status: 'organizer' },
        { groupId: 2, memberId: 5, status: 'co-host' },
        { groupId: 2, memberId: 8, status: 'member' },
        { groupId: 2, memberId: 1, status: 'member' },
        { groupId: 2, memberId: 9, status: 'pending' },
        { groupId: 3, memberId: 3, status: 'organizer' },
        { groupId: 3, memberId: 6, status: 'co-host' },
        { groupId: 3, memberId: 9, status: 'member' },
        { groupId: 3, memberId: 1, status: 'member' },
        { groupId: 3, memberId: 5, status: 'pending' },
        { groupId: 4, memberId: 4, status: 'organizer' },
        { groupId: 4, memberId: 1, status: 'co-host' },
        { groupId: 4, memberId: 10, status: 'member' },
        { groupId: 4, memberId: 7, status: 'member' },
        { groupId: 4, memberId: 2, status: 'pending' },
        { groupId: 5, memberId: 5, status: 'organizer' },
        { groupId: 5, memberId: 2, status: 'member' },
        { groupId: 5, memberId: 9, status: 'member' },
        { groupId: 5, memberId: 1, status: 'pending' },
        { groupId: 5, memberId: 6, status: 'pending' },
        { groupId: 6, memberId: 6, status: 'organizer' },
        { groupId: 6, memberId: 10, status: 'member' },
        { groupId: 6, memberId: 4, status: 'member' },
        { groupId: 6, memberId: 7, status: 'member' },
        { groupId: 6, memberId: 2, status: 'pending' },
        { groupId: 6, memberId: 3, status: 'pending' },
      ]
     }, {})
  }
};
