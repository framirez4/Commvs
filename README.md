# Commvs

API for a commerce listing app.

## Usage

As the server is HTTPS, a key and a certificate are needed. Server ('server.js' file) will read 'key.pem' and 'cert.pem'.
Use the following lines to generate the 'cert.pem'.
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

## API

The following routes are mounted over '/api'

### /comms
'''js
.post(commsController.postComms)
.get(commsController.getComms);
'''

### /comms/:comm_id
'''js
.get(commsController.getComm)
.put(commsController.putComm)
.delete(commsController.deleteComm);
'''

### ROUTES for USERS
### /users
'''js
.post(userController.postUsers)
.get(userController.getUsers);
'''
### /users/:user_id
'''js
.delete(userController.deleteUsers);
'''
