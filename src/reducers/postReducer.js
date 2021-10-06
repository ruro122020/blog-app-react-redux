export default (state = [], action) => {
  switch (action.type) {
    case "FETCH_POSTS":
      //Not using [...state, action.payload] because we are only fetching a list of posts and saving to our reducer once.
      //In other cases, where you see the spread operator used, we are merging the current state with some new state or adding a
      //new item to the existing state.
      return action.payload;
    default:
      return state;
  }
};
