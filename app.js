/*
curl -v -X GET 'http://localhost:3000/api/users'

curl -v -X GET 'http://localhost:3000/api/users/1001'

curl -v -X DELETE 'http://localhost:3000/api/users/1001'

curl -v -X POST -H 'Content-Type: application/json' \
     -d '{"firstName": "Ryan", "lastName": "Bard"}' \
     'http://localhost:3000/api/users'

curl -v -X POST -H 'Content-Type: application/json' \
     -d '{"id": 1002, "firstName": "JOHN", "lastName": "JONES"}' \
     'http://localhost:3000/api/users/1002'

curl -v -X PUT -H 'Content-Type: application/json' \
     -d '{"id": 1002, "firstName": "JOHN!!", "lastName": "JONES!!"}' \
     'http://localhost:3000/api/users/1002'
*/

var port = process.env.PORT || '3000',
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    usersMap = {
        1001: {id: 1001, firstName: 'John', lastName: 'Smith'},
        1002: {id: 1002, firstName: 'John', lastName: 'Jones'},
        1003: {id: 1003, firstName: 'Jane', lastName: 'Doe'},
        1004: {id: 1004, firstName: 'John', lastName: 'Doe'}
    },
    userIds = [
        1001,
        1002,
        1003,
        1004
    ],
    nextUserId = 1005;

app.disable('x-powered-by');

function getById(id) {
    return usersMap[Number(id)];
}

function getAllUsers() {
    return userIds.map(function (userId) {
        return getById(userId);
    });
}

function createOrUpdate(user) {
    if (!getById(user.id)) {
        userIds.push(user.id);
    }
    usersMap[Number(user.id)] = user;
}

function remove(id) {
    var user = usersMap[Number(id)];
    usersMap[Number(id)] = null;
    userIds = userIds.filter(function (userId) {
        return userId !== Number(id); // keep everything but the id being removed
    });
    return user;
}

function handleCreateOrUpdate(req) {
    var user = req.body;
    if (!user.id) {
        user.id = nextUserId;
        nextUserId += 1;
    }
    createOrUpdate(user);
    return user;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/users', function (req, res) {
    res.json(getAllUsers());
});

app.get('/api/users/:userId', function (req, res) {
    var id = req.params.userId,
        user = getById(id);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/users', function (req, res) {
    var user = handleCreateOrUpdate(req);
    res.json(user);
});

app.post('/api/users/:userId', function (req, res) {
    var user = handleCreateOrUpdate(req);
    res.json(user);
});

app.put('/api/users', function (req, res) {
    var user = handleCreateOrUpdate(req);
    res.json(user);
});

app.put('/api/users/:userId', function (req, res) {
    var user = handleCreateOrUpdate(req);
    res.json(user);
});

app.delete('/api/users/:userId', function (req, res) {
    var id = req.params.userId,
        user = remove(id);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
});

server = app.listen(port, function () {
    console.log('REST services listening at http://localhost:%s/api/users', port);
});
