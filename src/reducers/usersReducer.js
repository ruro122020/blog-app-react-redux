export default (state = [], action) => {
  switch (action.type) {
    case "FETCH_USER":
      console.log("action.payload", action.payload);
      return [...state, action.payload];
    default:
      return state;
  }
};
