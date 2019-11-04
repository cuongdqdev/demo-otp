const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Client = require('authy-client').Client;
const client = new Client({ key: 'zdia5L5nZU736Na79RUuB1JVbTd8yFdP' });
const session = require('express-session');
const config = require('./config/index')
const app = express();

// routing
const transactionsRoute = require('./routes/transaction.route');
const usersRoute = require('./routes/user.route');
let authMiddleware = require('./middlewares/user.middleware');

// api
const apiUserRoute = require('./routes/api/user.route');
const apiTransactionRoute = require('./routes/api/transaction.route');


// template ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session
app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
}));

// define routing
app.use('/transactions', authMiddleware.requireUserLogin, transactionsRoute);
app.use('/users', usersRoute);
app.use('/admin', authMiddleware.requireAdminLogin, usersRoute);

// define api routing
app.use('/api', apiUserRoute);
app.use('/api', authMiddleware.requireUserLogin, apiTransactionRoute);

app.get('/', (req, res) => {
    return res.render('index');
})

mongoose.connect(config.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", () => console.log(`MongoDB connected!`));

app.listen(config.PORT, () => console.log(`Server is running at port ${config.PORT}`));








