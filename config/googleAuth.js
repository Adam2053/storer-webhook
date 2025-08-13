import { google } from "googleapis";
import Token from "../models/googleDriveToken.js";

export const getGoogleAuthClient = async () => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Fetch the stored refresh token
  const tokenDoc = await Token.findOne(); // first document in collection
  if (!tokenDoc || !tokenDoc.refreshToken) {
    throw new Error("No refresh token found in DB");
  }

  // Set credentials with refresh token
  auth.setCredentials({
    refresh_token: tokenDoc.refreshToken
  });

  // Force Google API to refresh the access token
  await auth.getAccessToken(); // refreshes internally



  return auth;
};
