# Notes

## Redux Actions

1. Normal behavior of Action Creators inside a vanilla redux application are as follows:

- Action Creators **must** return action objects
- Actions must have a type property
- Actions can optionally have a payload

2. A Synchornous action creator instantly returns an action with data ready to go.

3. An Asynchronous action creator takes some amount of time for it to get its data ready to go. Any time there is a network request done in an action creator it'll be asynchronous.

4. If you want to make an API call in an action creator you need middleware that will allow you to handle asynchronous action creators.

## Redux Reducers

1. Reducers must return _any_ value besides 'undefined'
2. Reducers must produce 'state', or data to be used inside of your app using only previous state and the action.
   The first time a reducer is called it's going to be undefined so giving it a default value will fix this problem. When the reducer gets called again, the value of the variable will use the state that it changed to previously and the action.

```
                                    default value
                                          |
                                          V
const someReducerName = (variableName = null, action) => {}
```

3. Reducers should not go beyond its scoping purposes. Reducers are only suppose to look at state and action and use those 2 parameters to return a new state. They should be making API calls, accessing the DOM, etc.

4. Reducers must not mutate its input 'state' argument.

- Mutations examples in javascript you can do in a reducer:

  ```
  const arr = ["red", "green"];
  arr.push("purple") // output ["red", "green", "purple"]
  arr.pop() // output ["red", "green"]

  const obj = {name: "Sam"}

  obj.name = "Greg" // output {name: "Greg"}
  obj.age = 30 // output {name: "Greg", age:30}
  ```

- In javascript strings and numbers are immutable values.

  ```
  const name = "Sam"
  name[0] = "X" // output would still be "Sam"
  ```

  If you have a reducer returning a string or a number you don't have to worry about this mutation rule. If you're returning an object or an array make sure you're not mutating it in the reducer.

- The output for comparing objects and arrays with the same values will be false. This happens cause javascript stores objects and arrays in different memory locations. So obj1 is stored in a memory location and obj2 is stored in a different memory location. Same for array1 and array2. The comparison is between whether or not obj1 is referencing the exact same object in memory as in obj2, not the contents of the object. Same goes for array1 and array2. Since it doesn't then the result will be false.

  ```
  //comparing objects and arrays
  const obj1 = {name: "Sally"}
  const obj2 = {name: "Sally"}
  obj1 === obj2 // false

  const array1 = [1, 2, 3]
  const array2 = [1, 2, 3]
  array1 === array2 // false
  ```

_Redux Reducer Code_

This code can be found [here](https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts)

```
function combination (state={}, action){
  /*Some code*/

  /* this code is at the very bottom of the combinedReducers.js file in redux github. This section of the code explains exactly what it means not to mutate state in reducers. Any time you dispatch an action this block of code is executed*/

  //hasChanged will determine what gets returned from your reducers
  let hasChanged = false
  const nextState = {}

  // this 'for loop' iterates over all the different reducers you pass as an object into combinedReducers in your application
  for(let i = 0; i < finalReducerKeys.length; i++){
    const key = finalReducerKeys[i];
    const reducer = finalReducers[key]

    // this variable is assigned the last state value that this particular reducer (that we are iterating over) returned when it was last invoked
    const previousStateForKey = state[key]

    //This is where the reducer we are iterating over is invoked. The first argument is the state that the reducer
    //returned the last time it ran. Second argument is the action we passed in. When this reducer gets invoked again it'll return a
    //new state value. That new state value will be assigned to the 'nextStateForKey' variable.
    const nextStateForKey = reducer(previousStateForKey, action)

      //This code checks to see if your reducer returned a value of undefined and will throw an error if it did.
      if(typeof nextStateForKey === 'undefined'){
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }

    nextState[key] = nextStateForKey

    //This line explains what redux-thunk means when they say not to mutate your state.
    //This checks to see if nextStateForKey and previousStateForKey are the exact same array or object in memory.
    //If your current object/array state is in the same memory location as your previous state, hasChanged will be false.
    //If your current object/array state is in a new memory location than your previous state, hasChanged will be true.
    hasChanged = hasChanged || nextStateForKey !== previousStateForKey
  }
  //If hasChanged is false the result is to return state which is a referrence to ALL the state that your reducers returned the last
  //time they were invoked
  //If hasChanged is true the result is to return the new state object/array that has been assembled by ALL of your different reducers
  return hasChanged ? nextState : state
}

```

> Important Note: `hasChanged` is a variable that determines your state changes for all reducers. Not just the particular one that was being iterated over. So after the 'for loop' iterated through all your reducers, `hasChanged` will determine whether there was a new object/array in a different memory location in any of your reducers and the returns either the new object/array or keeps everything the same. It's an all or nothing kind of thing.

If redux returns the old state value even if the contents in the object/array was changed, its not going to notify your application that state has changed and the application will not rerender and receive any changes that where made within the object/array. This is why you don't want to "mutate" state.

```
const state = {name: 'Rob', age: 30}

const reducer (state, action) => {
  state.name = 'Kevin'
  state.age = 20

  //redux will return the old state and will not rerender your changes to your application because of how javascript compares objects
  return state
}
```

```
const state = [1, 2, 3]

const reducer (state, action) => {
  state.push(4)
  state.pop()

  //redux will return the old state and will not rerender your changes to your application because of how javascript compares arrays
  return state
}
```

**Proper way to change state in reducers**

_Manipulating arrays without mutating them_

1. Adding an element to an array

```
const colors = ['red', 'green']
//creates a new array in memory without changing the original colors array.
[...colors, 'blue', 'purple']
//output ['red', 'green', 'blue', 'purple']
or
['blue', 'purple', ...colors]
//output ['blue', 'purple','red', 'green']
```

2. Removing an element from an array

```
const colors = ['red', 'green']
//filter function returns a new array and original colors array is unchanged
colors.filter(color => color !== 'green')
//output ["red"]

```

3. Replacing/updating an element in an array

```
const colors = ['red', 'green']
//map function returns a new array and original colors array is unchanged
colors.map(el => el === 'red' ? 'blue': el)
//output ['blue', 'green']

```

_Manipulating objects without mutating them_

1. Adding a key/value to an object

```
const profile = {name: 'Alex'}
//creates a new object in memory without changing the original profile object.
{...profile, age: 30}
//output {name: 'Alex', age: 30}
```

2. Removing a key/value from an object. Since javascript uses `delete` to remove a key/value from an object and it doesn't create a new object, we will need to make use of the lodash library.

```
const profile = {name: 'Alex'}
//creates a new object in memory without changing the original profile object.
//_.omit takes 2 arguments. 1st the name of the object. 2nd the name of the key you want to delete
_.omit(profile, name)
//output {}

//without using lodash
{...profile, name: undefined}
//output {name: undefined}

```

3.  Replacing/updating a key/value in an object

```
const profile = {name: 'Alex'}
//creates a new object in memory without changing the original profile object.
{...profile, name: 'Robert'}
//output {name: 'Robert'}
```

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
