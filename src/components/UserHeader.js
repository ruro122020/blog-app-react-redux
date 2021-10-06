import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";

class UserHeader extends Component {
  componentDidMount() {
    this.props.fetchUser(this.props.userId);
  }

  render() {
    //the find function will return the first user.id that matches with this.props.userId and won't iterate through what is left
    const user = this.props.users.find((user) => user.id === this.props.userId);
    if (!user) {
      return null;
    }
    return <div className="header">{user.name}</div>;
  }
}

const mapStateToProps = (state) => {
  //state.users ends up having an array of users information because we return a new array in usersReducer
  //after calling Action every time, the state of user list keeps updating and will have more and more data.
  console.log("state", state);
  return { users: state.users };
};
export default connect(mapStateToProps, { fetchUser })(UserHeader);
