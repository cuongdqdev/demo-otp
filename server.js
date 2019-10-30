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

// definde routing
app.use('/transactions', transactionsRoute);
app.use('/users', usersRoute);

app.get('/home', (req, res) => {
    return res.json({ error: false, message: 'App is running!' });
})

mongoose.connect(config.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", () => console.log(`MongoDB connected!`));

app.listen(config.PORT, () => console.log(`Server is running at port ${config.PORT}`));








