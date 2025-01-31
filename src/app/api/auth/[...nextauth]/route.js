// import NextAuth from "next-auth";
// import User from "@/models/user";
// import connect from "@/lib/mongodb";
// import bcrypt from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import Github from "next-auth/providers/github";

// const handler = NextAuth({
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     Github({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         try {
//           await connect();
//           const user = await User.findOne({ email: credentials.email });
//           if (!user) {
//             throw new Error("");
//           }
//           const isValidPassword = await bcrypt.compare(
//             credentials.password ?? "",
//             user.password
//           );
//           if (!isValidPassword) {
//             throw new Error("invalid password");
//           }
//           return user;
//         } catch {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ account, profile }) {
//       if (account?.provider === "github") {
//         await connect();
//         const existingUser = await User.findOne({ email: profile?.email });
//         if (!existingUser) {
//           await User.create({
//             name: profile?.name,
//             email: profile?.email,
//             password: "",
//           });
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           email: token.email,
//           name: token.name,
//           image: token.picture,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import User from "@/models/user";
import connect from "@/lib/mongodb";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user user:email", // Ensure this scope is present
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      scope: "read:user user:email", // Ensure this scope is present
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // console.log("*******************");
      // console.log("GitHub Profile:", profile);
      // console.log("*******************");

      if (account.provider === "github") {
        await connect();

        const email = profile?.email || null;
        const name = profile?.name || "GitHub User"; // Default name if GitHub doesn't provide one

        if (!email) {
          // Check if email is missing; if so, return an error or redirect to a page where the user can input the email manually
          console.log("No email provided from GitHub, asking for manual input");
          // Option 1: Ask for manual email input (you can redirect to another page)
          throw new Error("Email is required for registration");
        }

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          // If no user exists, create a new one
          await User.create({
            name,
            email,
            password: null, // No password for OAuth users
          });
        }
      }
      if (account.provider === "google") {
        await connect();
        // console.log("*******************");
        // console.log("Google Profile:", profile);
        // console.log("*******************");

        const email = profile?.email || null;
        const name = profile?.name || "Google User"; // Default name if GitHub doesn't provide one

        if (!email) {
          // Check if email is missing; if so, return an error or redirect to a page where the user can input the email manually
          console.log("No email provided from Google, asking for manual input");
          // Option 1: Ask for manual email input (you can redirect to another page)
          throw new Error("Email is required for registration");
        }

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          // If no user exists, create a new one
          await User.create({
            name,
            email,
            password: null, // No password for OAuth users
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page (if needed)
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
