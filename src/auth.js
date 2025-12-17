import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";
import { config } from "./config.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.name?.givenName || "User";
        if (!email || !profile.id) {
          return done(new Error("Missing email or google id"));
        }

        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: { email, name },
          create: { email, name, googleId: profile.id },
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
