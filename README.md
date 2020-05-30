# Google Map with MERN Stack

MongoDB, Express js, React js, Node js


## Backend Node

```bash
create mongo database with name "gmapCrud"
restore dump file with "mongorestore --gzip --archive=/path/to/gmapCrud.archive"

npm install
npm start

backend will run on port 3001

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
  get      /places?page=1&name=park&category=apartment     get map list with filtering and pagination
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

Main Page

<a href="https://ibb.co/WVH1G97"><img src="https://i.ibb.co/XYWTjB6/mainpage.png" alt="mainpage" border="0"></a>




Detail Page

<a href="https://ibb.co/M7Zybpc"><img src="https://i.ibb.co/bXQjxLs/detailpage.png" alt="detailpage" border="0"></a>



CRUD Page

<a href="https://ibb.co/4Ky2NcS"><img src="https://i.ibb.co/pbDQXgK/crudpage.png" alt="crudpage" border="0" /></a>


Todo : 
- Responsive Layout
- Implement redux/context on frontend
- Pagination on CRUD page


