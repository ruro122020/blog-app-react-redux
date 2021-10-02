# Notes

## Redux

1. Normal behavior of Action Creators inside a vanilla redux application are as follows:

- Action Creators **must** return action objects
- Actions must have a type property
- Actions can optionally have a payload

2. A Synchornous action creator instantly returns an action with data ready to go.

3. An Asynchronous action creator takes some amount of time for it to get its data ready to go. Any time there is a network request done in an action creator it'll be asynchronous.

4. If you want to make an API call in an action creator you need middleware that will allow you to handle asynchronous action creators.

## Redux Cycle

Action Creator -> Action -> Dispatch -> Reducers -> State -> Wait 'til we need to update state again

## General Data Loading with Redux

1. Component gets rendered onto the screen
2. Component's "componentDidMount" lifecycle method gets called
3. We call action creator from "componentDidMount"
4. Action creator runs code to make an API request
5. API responds with data
6. Action creator returns an 'action' with the fetched data on the 'payload' property
7. Some reducer sees the action, returns the data off the 'payload'
8. Since we generated some new state object, redux/reat-redux causes our React app to be rerendered

## Redux Cycle with Middleware

Action Creator -> Action -> Dispatch -> Middleware -> Reducers -> State -> Wait 'til we need to update state again

## Middleware in Redux

1. Middleware is a function that gets called with every action we dispatch
2. Middleware has the ability to STOP, MODIFY, or otherwise mess around with actions
3. Inside of a single redux app you can have as many or as few middlewars as you want.
4. Most popular use of middleware is for dealing with async actions. There are a few others that help do other tasks.

## Redux Thunk Middleware

Redux thunk is a middleware that helps make api request in action creators. However, that is not its primary purpose.

1. Redux Thunk changes the normal rules of our action creator. With redux-thunk:

- Action Creators **can** return action objects _or_ functions.

If you return an object it still has to follow normal rules.
If you return a function, redux-thunk is going to automatically call that function for you.

### What Redux-Thunk is doing Internally

1.  An action creator is going to return an either an object or a function
2.  Then its going to take the object or function and pass it into the dispatch function
3.  The dispatch function will send the object or function to Redux-Thunk
4.  Redux-Thunk is going to take a look at the what the dispatch function sends it.

- If its an object Redux-Thunk going to pass it on to the reducers and do nothing to it.
- If its a function Redux-Thunk invokes the function and it passes into it the dispatch and 'getState' functions as arguments

```
export const fetchPosts = () => {
                      |         |
                      V         V
  return function (dispatch, getState){
    const promise = axios.get('/post');
    return {
      type:'FETCH_POSTS',
      payload: promise
    }
  }
}
```

- With dispatch you can change any data you want thats in the redux store
- With getState you can read or access any data that you want from the redux store

With Redux-Thunk you can manually dispatch an action at some point in time in the future.

5. When Redux-Thunks invokes our function with the dispatch and getState arguments, we are going to wait for the API request to finish.

6. Once the API comes back with a response, we then use the dispatch function to manually dispatch an action (which is mainly going to be an object) and update the data inside the redux store.

7. The object is going to flow into dispatch and then back into Redux-Thunk. Since its an object this time around, Redux-Thunk is going to pass it onto the Reducers.
   [Link to Redux-Thunk] (github.com/reduxjs/redux-thunk)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
