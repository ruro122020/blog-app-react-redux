import React, { Component } from "react";
import { connect } from "react-redux";

class UserHeader extends Component {
  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }
    return <div className="header">{user.name}</div>;
  }
}

//ownProps gives you access to the props being passed to UserHeader
const mapStateToProps = (state, ownProps) => {
  /*state.users ends up having an array of users information because we return a new array in usersReducer
  after calling Action every time so the state of user list keeps updating and will have more and more data.*/

  //the find function will return the first user.id that matches with this.props.userId and won't iterate through what is left
  return { user: state.users.find((user) => user.id === ownProps.userId) };
};
export default connect(mapStateToProps)(UserHeader);
