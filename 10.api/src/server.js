// import express from 'express'
// import bodyParser from 'body-parser'

// import { OAuth2Client }  from'google-auth-library';

// const app = express();
// const PORT = 7000;

// // Replace with your Google Client ID
// const CLIENT_ID = '667688154623-d46qeit3k88q7m1noi3ltobbg57j4fh6.apps.googleusercontent.com';

// const client = new OAuth2Client(CLIENT_ID);

// app.use(bodyParser.json());

// app.post('/verify-token', async (req, res) => {
//   const { token } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: CLIENT_ID,
//     });
//     const payload = ticket.getPayload();

//     console.log('User Info:', payload.sub);

//     res.status(200).json({
     
//       user: payload.sub,
//     });
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     res.status(401).json({
//       message: 'Invalid token',
//     });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
