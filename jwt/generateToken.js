import jwt from 'jsonwebtoken'; // Make sure you have installed jsonwebtoken

// JWT Token generation function
const generateWebToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expiration time (1 day in this example)
  });

  // Set the token as a cookie (secure settings can vary based on your environment)
  res.cookie('token', token, {
    httpOnly: false, // Prevent access by JavaScript on the client side
    secure: process.env.NODE_ENV === 'production', // Set `true` in production (requires HTTPS)
    sameSite: 'Strict', // Prevent CSRF by controlling cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  // res.cookie('token', token, {
  //   httpOnly: false,
  //   secure: process.env.NODE_ENV === 'production', // Set true only for HTTPS
  //   sameSite: 'None', // Required for cross-origin cookies
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // });
  
  
};

export default generateWebToken;