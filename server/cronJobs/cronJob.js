const schedule = require('node-schedule');
const { Users } = require('../models');

// run every first day of the month at 00:00
// This gives out the tokens to the users
const job = schedule.scheduleJob('0 0 1 * *', async () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const countUsers = await Users.count({ where: { createdAt: { [Op.lt]: lastMonth } } });
  const users = await Users.findAll();
  const sumMonthlyPoints = users.reduce((acc, user) => acc + user.monthly_points, 0);
  const tokens = countUsers * 80;

  users.forEach(async (user) => {
    user.points += Math.round(user.monthly_points / sumMonthlyPoints * tokens);
    user.monthly_points = 0;
    await user.save();
  });
  
  console.log(`The cron job was executed. ${countUsers} users were found.`);
  console.log(`The sum of monthly points for all users is ${sumMonthlyPoints}.`);
  // Here you can add the function that updates something in the db
});

module.exports = job;