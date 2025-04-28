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
      let user = await userModel.findOne({
        $or: [{ googleId: profile.id }, { email }],
      });
      if (!user) {
        user = await userModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email,
          avatar: profile.photos[0]?.value,
          authMethod: "google",
          isAccountVerified: true,
          createdAt: new Date(),
        });
        logger.info(`New google user created: ${user.email}`);
      }
      done(null, user);
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
