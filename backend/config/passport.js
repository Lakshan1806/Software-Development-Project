import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/usermodel.js";
import logger from "../utils/logger.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const terminatedUser = await userModel.findOne({
          email,
          isTerminated: true
        });
        if (terminatedUser) {
          return done(null, false, { message: "Account terminated" });
        }
        
        const existingGoogleUser = await userModel.findOne({
          googleId: profile.id,
        });
        if (existingGoogleUser) {
          return done(null, existingGoogleUser);
        }

        const existingLocalUser = await userModel.findOne({
          email,
          authMethod: "local",
        });

        if (existingLocalUser) {
          existingLocalUser.googleId = profile.id;
          existingLocalUser.authMethod = "google";
          existingLocalUser.password = undefined;
          existingLocalUser.isAccountVerified = true;
          existingLocalUser.avatar = profile.photos[0]?.value;
          await existingLocalUser.save({ validateBeforeSave: false });
          logger.info(`Converted local user to Google auth: ${email}`);
          return done(null, existingLocalUser);
        }

        const newUser = await userModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email,
          avatar: profile.photos[0]?.value,
          authMethod: "google",
          isAccountVerified: false,
          phone: `google-${profile.id}`
        });

        logger.info(
          `New google user created (pending phone verification): ${email}`
        );
        done(null, newUser);
      } catch (error) {
        logger.error(`Error in Google strategy: ${error.message}`);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
