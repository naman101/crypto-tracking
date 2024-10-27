# Crypto Tracking App

A simple scalable app build to display the top 100 crypto currencies and track their realtime prices

## Application Overview

This app performs the following basic functionalities:

- View top 100 crypto currencies in the market
- Sort the list of currenciies either by their rank, name or symbol
- Search for a particular currency
- Mark any currency as their favourite which persists across sessions using local storage
- The user can open details page of any of the currencies to view its daily average in the last 30 days

This app is built on top of the following core stack:

- [ReactJS](https://react.dev/): For client side rendereing of the application
- [React-Router](https://reactrouter.com/en/main): For handling routes and navigation
- [Typescript](https://www.typescriptlang.org/): For a strongly typed language

## Get Started

To set up the app execute the following commands.

```bash
git clone https://github.com/naman101/crypto-tracking.git
cd cryto-tracking
npm install
```

##### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

##### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Project Structure

Most of the code lives in the `src` folder and looks something like this:

```sh
src
|
+-- components        # shared components used across the entire application
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- providers         # global state stores
|
+-- testing           # test utilities and mocks
|
+-- utils             # shared utility functions
```

And a features folder would look something like this:

```sh
src/features/crypto-list
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- routes      # Multiple pages as well as the route definition of that particular feature
|
+-- hooks       # hooks scoped to a specific feature
|
+-- types       # typescript types used within the feature
|
+-- __testing__ # tests for that particular feature

```

The features folder can be expanded to include more functionality like feature specific states, assets and utils, a feature deos not mean a specific page but how you would describe a generic part of a product, for example, in a garage, there are cars and doors, car would be one feature and the door another.

## Styling, Components & Design

Across the board for components I am only using components as well as its peer dependencies provided by <b>[shadcn/ui](https://ui.shadcn.com/)</b> and for styles I am only using classes provided by <b>[tailwindcss](https://tailwindcss.com/)</b>.

## API & Data Fetching

This project makes use of <b>[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)</b> since it provides out of the box support for caching as well as all the essential data fetching logic.
It also allows me to have all the data fetching logic at one place in a feature which results in a neat, cleaner codebase.\
Currently all the crypto data provided comes from <b>[CoinCap APIs](https://docs.coincap.io/#intro)</b> in its free tier without the API key.
