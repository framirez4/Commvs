# Commvs

API for a commerce listing app.

## Setup
```
sudo npm install
node server.js
```

## Usage
Server will load configuration from ```config.js``` file. All values can be customized by adding a ```.env``` file:
+ **Route to MongoDB**: DB_HOST, *default: ```'mongodb://localhost:27017/commvs'```*.
+ **Port**: PORT, *default value: ```3000```*.
+ **Password**: secret used to ```sign``` and ```verify``` JWTs.
  + *default: ```'secret'```*


## API

All routes from ```router``` are mounted over ```'/'```
### ROUTES for COMMS
#### #/comms
+ 'GET': No data required.
+ 'POST': Headers ```x-access-token```. Admin required.

#### #/comms/:comm_id
+ 'GET'
+ 'PUT': Headers ```x-access-token```. Admin or Owner required.
+ 'DELETE': Headers ```x-access-token```. Admin required.
#### #/comms/:comm_id/ownerkey
+ 'GET': Headers ```x-access-token```. Admin required.
+ 'POST': Headers ```x-access-token```. Owner required.

### ROUTES for USERS
#### #/users
+ 'POST': No date required.
+ 'GET': Headers ```x-access-token```. Admin required.
#### #/users/:user_id
+ 'GET': Headers ```x-access-token```. Admin or Owner required.
+ 'PUT': Headers ```x-access-token```. Admin or Owner required.
+ 'DELETE': Headers ```x-access-token```. Admin required.
