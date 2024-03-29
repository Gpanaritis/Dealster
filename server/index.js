require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {verifyToken} = require('./middleware/authJwt');
const schedule = require('./cronJobs/cronJob');

app.use(express.json());
app.use(cors());

const db = require('./models');

// Routers
const usersRouter = require('./routes/Users');
const categoriesRouter = require('./routes/Category');
const subcategoriesRouter = require('./routes/Subcategory');
const productsRouter = require('./routes/Products');
const offersRouter = require('./routes/Offers');
const supermarketsRouter = require('./routes/Super_markets');
const ReactionsRouter = require('./routes/Reactions');
const rolesRouter = require('./routes/Roles');
const pointsRouter = require('./routes/Points');
const tokensRouter = require('./routes/Tokens');
const priceHistoryRouter = require('./routes/Price_history');

app.use('/auth', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/products', productsRouter);
app.use('/offers', offersRouter);
app.use('/supermarkets', supermarketsRouter);
app.use('/reactions', ReactionsRouter);
app.use('/roles', rolesRouter);
app.use('/points', pointsRouter);
app.use('/tokens', tokensRouter);
app.use('/price_history', priceHistoryRouter);

// Middleware to set cache-control headers
app.use((req, res, next) => {
    // Cache images and CSS for 7 days
    if (req.url.match(/\.(jpg|jpeg|png|svg|css)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days in seconds
    } 
    // Cache JavaScript (JS) for 1 day
    else if (req.url.match(/\.js$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day in seconds
    } 
    // For other resources, set no-cache headers
    else {
        res.setHeader('Cache-Control', 'no-store');
    }
    next();
});

// schedule.start();

db.sequelize.sync().then(() => {
    app.listen(3000, () => {
    console.log('Server listening on port 3000');
    });
});