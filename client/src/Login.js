import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from './AuthContext';

const Login = () => {
  const [formType, setFormType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { setLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/csrf-token", { withCredentials: true })
      .then((response) => {
        const token = response.headers["x-csrf-token"];
        setCsrfToken(token);
      })
      .catch((error) => {
        console.error("Failed to fetch CSRF token:", error);
      });
  }, []);

  const handleFormType = (type) => {
    setFormType(type);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Login Successful`);
  
    const requestData = {
      username,
      password,
    };
  
    const headers = {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };
  
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }
  
    axios
      .post("/login", requestData, {
        withCredentials: true,
        headers,
      })
      .then((response) => {
        if (response.data.message === 'Login successful') {
          // Store the authentication token or user information in local storage
          localStorage.setItem('isLoggedIn', 'true');
          // Alternatively, you can store the user information:
          // localStorage.setItem('user', JSON.stringify(response.data.user));
          setLoggedIn(true);
        } else {
          console.log('Invalid username or password');
        }
      })
      .catch((error) => {
        console.log('Login error:', error);
      });
  };  

  const handleNewUser = (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      console.log("Password and confirmation do not match");
      return;
    }
    console.log(`New User ${firstName} ${lastName} Created! Username: ${username}`);

    const requestData = {
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,
    };

    const headers = {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };

    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    axios
      .post("/owners", requestData, {
        withCredentials: true,
        headers: headers,
      })
      .then((response) => {
        // Handle the new user creation response
        setLoggedIn(true); // Assuming that creating a new user logs them in
      })
      .catch((error) => {
        // Handle the new user creation error
      });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input className="login-field" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input className="login-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className="button-login">Log In</button>
      <button className="button-login" onClick={handleForgotPassword}>Forgot Password</button>
      <button className="button-login" onClick={handleDeleteAccount}>Delete Account</button>
  </form>
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();

    const new_password = window.prompt('Enter a new password:');

    // Update the password on the server
    axios
        .patch("/update-password", { username, new_password }, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};

const handleDeleteAccount = (e) => {
  e.preventDefault();

  const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

  if (!confirmation) {
      return;
  }

  axios
      .delete("/delete-account", { data: { username, password } }, {
          headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "application/json",
          },
      })
      .then((response) => {
          if (response.data.message === 'Account deleted successfully') {
              console.log(response.data.message);
              // Here you could do something to remove the user's data from the frontend
              setLoggedIn(false);  // assuming you have a way to handle logging out
          } else {
              console.log('Invalid username or password');
          }
      })
      .catch((error) => {
          console.log('Delete account error:', error);
      });
};

  const renderNewUserForm = () => (
    <form onSubmit={handleNewUser}>
      <label>
        First Name:
        <input className="login-field"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last Name:
        <input className="login-field"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input className="login-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Username:
        <input className="login-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input className="login-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Confirm Password:
        <input className="login-field"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
      </label>
      <button className="button-login" type="submit">Create New User</button>
    </form>
  );

  return (
    <div className="container">
      <div className="title">Welcome to Eventable!</div>
      <div className="description">Event Planning Made Simple</div>
      <div>
        <button className="button-login" onClick={() => handleFormType("login")}>Returning User</button>
        <button className="button-login" onClick={() => handleFormType("newUser")}>New User</button>
        {formType === "login" && renderLoginForm()}
        {formType === "newUser" && renderNewUserForm()}
      </div>
    </div>
  );
};

export default Login;