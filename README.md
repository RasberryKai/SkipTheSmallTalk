
# Skip The Small Talk!

Skip The Small Talk is a mobile card game. You and the lucky people near you are prompted question written
on cards. On each turn, you ask the prompted person the question written. This cycle repeats
until you have played through the level, and afterwards the deck of cards. Using this method, you
don't get to know each other like you just had your first conversation, but really get to know
what drives them, and why they wake up each morning.


## Demo
To see a live demo of the app, go to https://playstst.com
## Prerequisites

1. Yarn needs to be installed `npm i -g yarn`
2. Environments need to be created -> create an environments folder in the root directory, and
inside the environments folder a dev, and a prod one. Then put the .env files in dev and prod.

## Install and Run

1. `git clone https://github.com/RasberryKai/SkipTheSmallTalk.git`
2. `yarn`

After installing you can run the application.

- `yarn dev` for running the app in development mode.
- `yarn build` for building the app.
- `yarn start` for serving the app locally.
    
## Tech Stack

**React:** Frontend Framework.

**Supabase**: Backend Service.

## Deployment
In order to deploy the app, you push your changes to the main branch, and DigitalOcean
handles the rest.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_SUPABASE_URL`

`REACT_APP_SUPABASE_ANON_KEY`

