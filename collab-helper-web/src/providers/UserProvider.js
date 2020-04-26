import React, { Component, createContext } from 'react';
import { auth, generateUserDocument } from '../firebase';

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  async componentDidMount() {
    auth.onAuthStateChanged(async (userAuth) => {
      const user = await generateUserDocument(userAuth);
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    const { children } = this.props;
    return (
      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;
