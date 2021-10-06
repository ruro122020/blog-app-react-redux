import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

//one way to solve the over fetching issue
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());
  //_.uniq returns an array with the unique users id's
  const userIds = _.uniq(_.map(getState().posts, "userId"));
  //call fetchUser action creator for each users id
  userIds.forEach((id) => dispatch(fetchUser(id)));

  //another way to write out the code in line 8 and 10
  // _.chain(getState().posts)
  //   .map("userId")
  //   .uniq()
  //   .forEach((id) => dispatch(fetchUser(id)))
  //   .value();
  //value() makes sure the code above it gets executed
};

//line 3 as double fat arrows. It indicates that it's returning a function within the fetchPosts function.
export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: "FETCH_USER", payload: response.data });
};

/*
//another way to solve the over fetching issue
export const fetchUser = (id) => (dispatch) => {
  _fetchUser(id, dispatch);
};

Since the action creator gets called multiple times for the same user memoize fetches each user one time 
which prevent it from fetching the same user multiple times.

const _fetchUser = _.memoize(async (id, dispatch) => {
   const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: "FETCH_USER", payload: response.data });
});
*/
