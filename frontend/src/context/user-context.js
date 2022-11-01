import { createContext, useState } from 'react';

import axios from 'axios';

import { 
  URL_USER_SVC_SIGNIN, 
  URL_USER_SVC_JWT_VERIFICATION, 
  URL_USER_SVC_LOGOUT, 
  URL_USER_SVC_UPDATE, 
  URL_USER_SVC_DELETE,
} from '../configs';
import { STATUS_CODE_OK } from '../constants';

const UserContext = createContext({
  username: '',
  isSignedIn: false,
  onVerifyToken: () => {},
  onSignout: () => {},
  onSignin: () => {},
  onUpdateAccount: () => {},
  onDeleteAccount: () => {},
});

export function UserContextProvider(props) {
  const [username, setUsername] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const verifyTokenHandler = async (callback) => {
    await axios
      // Must set "withCredentials" to true so the cookie stored on browser
      // is sent to the server for checking
      .get(URL_USER_SVC_JWT_VERIFICATION, { withCredentials: true })
      .then((res) => {
        const isAuthSuccess = res && res.status === STATUS_CODE_OK;
        setIsSignedIn(isAuthSuccess);
        callback(isAuthSuccess, null);
        return res.data;
      })
      .then((data) => setUsername(data.username))
      .catch((error) => {
        setIsSignedIn(false);
        callback(false, error);
      });
  };

  const signinHandler = async (username, password, callback) => {
    await axios
      .post(
        URL_USER_SVC_SIGNIN,
        {
          username,
          password,
        },
        { withCredentials: true } // Crucial step to make sure the cookie is stored in browser
      )
      .then((res) => {
        const isSigninSuccess = res && res.status === STATUS_CODE_OK;

        setIsSignedIn(isSigninSuccess);
        setUsername(username);
        callback(isSigninSuccess, null);
      })
      .catch((err) => {
        callback(false, err);
      });
  };

  const signoutHandler = async (callback) => {
    await axios
      // Must set "withCredentials" to true so the cookie stored on browser
      // is sent to the server for checking
      .post(URL_USER_SVC_LOGOUT, {}, { withCredentials: true })
      .then((res) => {
        const isSignoutSuccess = res && res.status === STATUS_CODE_OK;
        setIsSignedIn(!isSignoutSuccess);
        return res.data;
      })
      .then((data) => {
        callback(data.message, null);
      })
      .catch((error) => {
        setIsSignedIn(false);
        callback(false, error);
      });
  };

  const updateAccountHandler = async (newUsername, newPassword, callback) => {
    await axios
      // Must set "withCredentials" to true so the cookie stored on browser
      // is sent to the server for checking
      .post(
        URL_USER_SVC_UPDATE,
        { newUsername, newPassword },
        { withCredentials: true }
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        callback(data.message, null);
      })
      .catch((error) => {
        setIsSignedIn(false);
        callback(false, error);
      });
  };

  const deleteAccountHandler = async (callback) => {
    await axios
      // Must set "withCredentials" to true so the cookie stored on browser
      // is sent to the server for checking
      .post(
        URL_USER_SVC_DELETE,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const isDeleteSuccess = res && res.status === STATUS_CODE_OK;
        setIsSignedIn(!isDeleteSuccess); // Sign user out if delete success, else stay
        return res.data;
      })
      .then((data) => {
        callback(data.message, null);
      })
      .catch((error) => {
        setIsSignedIn(false);
        callback(false, error);
      });
  };

  return (
    <UserContext.Provider
      value={{
        username,
        isSignedIn,
        onVerifyToken: verifyTokenHandler,
        onSignin: signinHandler,
        onSignout: signoutHandler,
        onUpdateAccount: updateAccountHandler,
        onDeleteAccount: deleteAccountHandler,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
