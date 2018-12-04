const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const app = express();
const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;
const db = mongojs('customapp', ['users']);

/* 
const logger = function(req, res, next) {
	console.log('Logging...');
	next();
};
app.use(logger);
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.locals.errors = null;
	next();
});

app.use(
	expressValidator({
		errorFormatter: (param, msg, value) => {
			let namespace = param.split('.'),
				root = namespace.shift(),
				formParam = root;
			while (namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);

app.get('/', (req, res) => {
	db.users.find((err, docs) => {
		res.render('index', {
			title: 'Customers',
			users: docs
		});
	});
});

app.post('/users/add', (req, res) => {
	req.checkBody('firstName', 'First Name is required').notEmpty();
	req.checkBody('lastName', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
		console.log('Errors');
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
		res.redirect('/');
	} else {
		let newUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		};

		db.users.insert(newUser, (err, result) => {
			if (err) {
				console.log(err);
			}
			res.redirect('/');
		});

		console.log('Success');
	}
});

app.delete('/users/delete/:id', function(req, res) {
	console.log(req.params.id);
	db.users.remove({ _id: ObjectId(req.params.id) }, function(err) {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, () => {
	console.log('App listening on port: 3000!');
});
