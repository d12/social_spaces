import React from "react"
import PropTypes from "prop-types"
class Greeting extends React.Component {
  render () {
    return (
      <React.Fragment>
        Hello {this.props.userName}!
      </React.Fragment>
    );
  }
}

Greeting.propTypes = {
  userName: PropTypes.string
};
export default Greeting
