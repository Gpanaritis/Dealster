const express = require('express');
const app = express();
const cors = require('cors');

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

app.use('/auth', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/products', productsRouter);
app.use('/offers', offersRouter);
app.use('/supermarkets', supermarketsRouter);
app.use('/reactions', ReactionsRouter);


db.sequelize.sync().then(() => {
    app.listen(3000, () => {
    console.log('Server listening on port 3000');
    });
});