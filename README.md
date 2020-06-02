# Google Map with MERN Stack

MongoDB, Express js, React js, Node js


## Backend Node

```bash

update database config on \config\database.config.js

npm install
npm start

backend will run on port 3001


optional : 
create mongo database with name "gmapCrud"
restore dump file with "mongorestore --gzip --archive=/path/to/gmapCrud.archive"

```


## Frontend React

```bash
cp .env.example .env, 
update google maps api key on .env file

npm install
npm start

Open Browser with Url: http://localhost:3000/

```

## Rest API design

```
  get      /places?page=1&limit=4&name=park&category=apartment     get map list with filtering and pagination
  get      /places/list              get map list
  get      /places/5                 get a map
  post     /places/                  create a map
  put      /places/5                 update a map
  delete   /places/5                 delete a map
    
  DB Structure
  {
     "name": "name",
     "category": "apartment",
     "description": "desc",
     "address": "address",
     "city": "city1",
     "coordinate": {
         "lat": 23,
         "lng": 22
     },
     "facilities": ["fas1", "fas2", "fas3", "fas4"],
     "images" : ["img1","img2","img3","img4"]
  }
```


I made 2 version of react, react with hooks and react with redux


Main Page

![Screenshoot](https://i.ibb.co/XYWTjB6/mainpage.png)




Detail Page

![Screenshoot](https://i.ibb.co/bXQjxLs/detailpage.png)




CRUD Page with hooks

![Screenshoot](https://i.ibb.co/dBgJ22y/crudpage.png)




CRUD Page with Redux and Material UI

![Screenshoot](https://i.ibb.co/QD0jr1D/react-redux.png)



Todo : 
- Responsive Layout


