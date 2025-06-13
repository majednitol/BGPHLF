import pkg from 'jsonwebtoken';
const { verify, TokenExpiredError, JsonWebTokenError, NotBeforeError } = pkg;
import createHttpError from "http-errors";
import config from "../config/config.js";


const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);

  // Check if token exists
  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    // Extract the token from the Bearer scheme
    const parsedToken = token.split(" ")[1];
    if (!parsedToken) {
      return next(createHttpError(401, "Bearer token is missing or malformed."));
    }

    // Verify the token
    const decoded = verify(parsedToken, config.jwt_secret);
    console.log("decoded", decoded.org)
    req.userId = decoded.sub;
    req.org = decoded.org;
    req.role= decoded.role;
    next();
  } catch (error) {
    // Handle specific token errors
    if (error instanceof TokenExpiredError) {
      return next(createHttpError(401, "Token has expired."));
    }
    if (error instanceof JsonWebTokenError) {
      return next(createHttpError(401, "Invalid token provided."));
    }
    if (error instanceof NotBeforeError) {
      return next(createHttpError(401, `Token cannot be used before: ${error.date}`));
    }

    // Handle unexpected errors
    return next(createHttpError(500, "An unexpected error occurred during token verification."));
  }
};

export default authenticate;
// import { OAuth2Client } from 'google-auth-library';
// import createHttpError from 'http-errors';

// const CLIENT_ID = '667688154623-d46qeit3k88q7m1noi3ltobbg57j4fh6.apps.googleusercontent.com';
// const client = new OAuth2Client(CLIENT_ID);

// const authenticate = async (req, res, next) => {
//   const token = req.header('Authorization');

//   console.log('Received Token:', token);

 
//   if (!token) {
//     return next(createHttpError(401, 'Authorization token is required.'));
//   }

//   try {
   
//     const parsedToken = token.split(' ')[1];
//     if (!parsedToken) {
//       return next(createHttpError(401, 'Bearer token is missing or malformed.'));
//     }

  
//     const ticket = await client.verifyIdToken({
//       idToken: parsedToken,
//       audience: CLIENT_ID,
//     });

//     const payload = ticket.getPayload(); // Extract payload
//     console.log('Decoded Payload:', payload);


//     // req.user = {
//     //   id: payload.sub,
//     //   email: payload.email,
//     //   name: payload.name,
//     //   picture: payload.picture,
//     // };
//     req.userId = payload.sub;
//     req.org = "Org1MSP";
//     next(); 
//   } catch (error) {
//     console.error('Error verifying token:', error);

 
//     if (error.message.includes('Wrong number of segments')) {
//       return next(createHttpError(401, 'Invalid token format.'));
//     }
//     return next(createHttpError(401, 'Invalid or expired token.'));
//   }
// };

// export default authenticate;
