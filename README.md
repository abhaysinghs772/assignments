
## Installation

```bash
$ git clone https://github.com/abhaysinghs772/assignments.git
```

```bash
$ cd assignments/
```

```bash
$ git checkout -b tickete origin/ticket && cd tickete/ 
```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Tech
- [Nest.js] - a progressive web framWork
- [node.js] - evented I/O for the backend
- [Express] - used it as middleware.
- [AWS] - used this in order to host the backend
- [amazon RDS] - used this to host pgSQl


1. Added one more ep in order ot fetch all the slots and then using there ids in the 2 ep.
2. please find the api collection in root directory of this project and run the ep starts with localhost:3000.
3. this project is also hosted live on AWS, in order to check live ep replace localhost:3000 to http://13.51.233.157:3000/<end-point>

4. http://13.51.233.157:3000/api/v1/experience/slots // api to fetch all slots 
5. http://13.51.233.157:3000/api/v1/experience/:id/slots?dates='dd-mm-yyy' // slots api 
6. http://13.51.233.157:3000/api/v1/experience/:id/dates // dates api


## further optimizations
1. The root functionality of this project depends on the cron services it utilzes under the hood.
   this cron services can be optimizd further by dividing the cron jobs further (time interval to 
   hit the api ).

2. I have done very basic level of error handeling and it can be optimized further also, in order 
   to ensure the stability and scalebility of the application or feature by implementing the some really 
   nice third party services like mezmo (provides a very decent way logging not only the error but also 
   the whole http request as well) and and bugsnag (keeps track of all exceptions happeing in the system).

3. one of the main problem i found with the current application is that, at some places in the application 
   it violates the ATOMICITY of the applicaton with the database, since we are using a sql based database
   we can implement transectional queries as well in order to ensure ATOMICITY further. currently working on
   it and will fix this as well.
 

## NOTE
   IT MIGHT HAPPEN WHILE REVIEWING THE APIS, YOU MIGHT NOT GET RESPONSE BECAUSE 
   THE APIS ARE WORKING ON HTTP PROTOCOL AND SOME POPULAR BROWSERS CHANGES THE URL LIKE THIS 
   http://13.51.233.157:3000/api/v1/experience/slots --> http://www.13.51.233.157.com:3000/slots 
   PLEASE MAKE SURE TO REMOVE THE WWW AND .com.
   In order tp prevent this use postman.