# Google Maps in React

Using MERN Stack with MongoDB


## Backend Node

```bash
create mongo database with name "gmapCrud"
restore dump file with command "mongorestore --gzip --archive=/path/to/gmapCrud.archive"

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


Main Page

![Screenshoot](mainPage.png)



Detail Page

![Screenshoot](detailPage.png)



Todo : 
- Responsive Layout
- Implement CRUD on frontend