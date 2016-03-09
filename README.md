# Commvs

API for a commerce listing app.

## Usage
Server will load configuration from ```config.js``` file. All values can be customized by adding a ```.env``` file:
+ **Route to MongoDB**: DB_HOST, *default: ```'mongodb://localhost:27017/commvs'```*. 
+ **Port**: PORT, *default value: ```3000```*.
+ **Options**: routes to options ```key``` and ```cert```.
  + OPTIONS_KEY, *default: ```'./keys/key.pem'```*
  + OPTIONS_CERT, *default: ```'./keys/cert.pem'```*
+ **Password**: secret used to ```sign``` and ```verify``` JWTs.
  + *default: ```'secret'```*

As passwords and JWTs are sent to the server, it is required a secure server HTTPS. The following lines can be used to generate the ```key``` and ```cert``` required by ```config.js```:

```
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

## API

All routes from ```router``` are mounted over ```'/api'```
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
