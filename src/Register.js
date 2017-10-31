import React, { Component } from 'react'
import RForm from './components/RegisterForm'
import { registerUser } from './api';

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      email: '',
      submitted: false
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    await registerUser(this.props.account, this.state.first_name, this.state.email)
    this.setState({
      first_name: '',
      email: '',
      submitted: true
    })
  }

  render() {
    const { submitted } = this.state;
    return submitted ? <h1> Thanks </h1>
                     : <div className="register-form">
                        <RForm
                          onChange={this.handleChange}
                          onSubmit={this.handleSubmit} {...this.props}  />
                      </div>
  }
}

export default Register
