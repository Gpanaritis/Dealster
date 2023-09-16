const schedule = require('node-schedule');
const { Users, Points, Tokens, Price_history, Products, Offers } = require('../models');

const findMeanPriceYesterday = (productId) => {
  return new Promise(async (resolve, reject) => {
      try {
          const today = new Date();
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
          const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
          const priceHistory = await Price_history.findOne({
              where: {
                  product_id: productId,
                  createdAt: { [Op.between]: [startOfDay, endOfDay] }
              }
          });
          resolve(priceHistory.price);
      } catch (error) {
          reject(error);
      }
  });
};

const findMeanPriceWeek = (productId) => {
  return new Promise(async (resolve, reject) => {
      try {
          const today = new Date();
          const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0, 0);
          const priceHistory = await Price_history.findAll({
              where: {
                  product_id: productId,
                  createdAt: { [Op.gte]: oneWeekAgo }
              }
          });

          const prices = priceHistory.map(price => parseFloat(price.price));
          const meanPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;            resolve(meanPrice);
      } catch (error) {
          reject(error);
      }
  });
};

// run every first day of the month at 00:00
// This gives out the tokens to the users
const job = schedule.scheduleJob('0 0 1 * *', async () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const countUsers = await Users.count({ where: { createdAt: { [Op.lt]: lastMonth } } });
  const users = await Users.findAll();
  const sumMonthlyPoints = await Points.sum('points', { where: { createdAt: { [Op.gte]: lastMonth } } });
  const tokens = countUsers * 80;

  users.forEach(async (user) => {
    user_points = await Points.sum('points', { where: { user_id: user.id } });
    user_tokens += Math.round(user_points / sumMonthlyPoints * tokens);

    const tokenEntry = await Tokens.create({
      token: user_tokens,
      user_id: user.id
    });
  });

  console.log(`The cron job was executed. ${countUsers} users were found.`);
  console.log(`The sum of monthly points for all users is ${sumMonthlyPoints}.`);
  // Here you can add the function that updates something in the db
});

// run every day at 02:00
// This calculates mean price for each product and updates the price_history table
const job2 = schedule.scheduleJob('0 2 * * *', async () => {
  const products = await Products.findAll();
  products.forEach(async (product) => {
    const offers = await Offers.findAll({ where: { product_id: product.id, stock: true } });

    // convert the offer prices to numbers
    const numericPrices = offers.map((offer) => parseFloat(offer.price));

    // Sum of numeric prices
    const sum = numericPrices.reduce((acc, price) => acc + price, 0);

    // Calculate mean price
    const meanPrice = offers.length > 0 ? (sum + parseFloat(product.price)) / (offers.length + 1) : parseFloat(product.price);

    const priceEntry = await Price_history.create({
      price: meanPrice,
      product_id: product.id
    });
  });
  console.log(`The cron job was executed. ${products.length} products were found.`);
  // Here you can add the function that updates something in the db
});

// remove offers that are older than 14 days
// remove offers that are older than 7 days if they are not good offers
const job3 = schedule.scheduleJob('0 0 * * *', async () => {
  const offers = await Offers.findAll();
  const today = new Date();
  const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const twoWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  await Offers.destroy({ where: { createdAt: { [Op.lt]: twoWeeksAgo } } }); 
  for (const offer of offers) {
    if (offer.createdAt < oneWeekAgo && offer.price > await findMeanPriceYesterday(offer.product_id) && offer.price > await findMeanPriceWeek(offer.product_id) ) {
      await offer.destroy();
    }
  }
  console.log(`The cron job was executed. ${offers.length} offers were found.`);
  // Here you can add the function that updates something in the db
});

module.exports = {
  job1: job,
  job2: job2,
  job3: job3
};