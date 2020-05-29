# Google Maps in React

Using MERN Stack

## Getting Started

## Backend Node

create mongo database with name "gmapCrud"
import dump file into mongodb with command "mongorestore --gzip --archive=gmapCrud.archive"

```bash
npm install
npm start

backend will run on port 3001

```


## Frontend React

```bash
cp .env.example .env, 
update google maps key on .env file

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