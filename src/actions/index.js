import jsonPlaceholder from "../apis/jsonPlaceholder";
//line 3 as double fat arrows. It indicates that it's returning a function within the fetchPosts function.
export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  console.log("response", response);
  dispatch({ type: "FETCH_USER", payload: response.data });
};
