// chalkitup/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"; // <--- Add Email Provider
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { createTransport } from "nodemailer";
import html from "./emailTemplates"; // Import the HTML email template

interface EmailServerConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export const authOptions: NextAuthOptions = {
  // Pass the Prisma Adapter to integrate with your PostgreSQL database
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: parseInt(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,

      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host, port, auth } = provider.server as EmailServerConfig;

        const transporter = createTransport({
          host,
          port,
          auth,
        });
        console.log(host)
        // 2. Send the mail
        await transporter.sendMail({
          to: email,
          from: provider.from, // Use provider.from directly
          subject: `Sign In to Chalk It Up`,
          html: html({ url, host: host as string, email }),
          text: `Sign in to Chalk It Up by visiting this URL: ${url}`,
        });
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, 

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      if (trigger === 'update' && token.id) {
        const latestUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, image: true }
        });

        if (latestUser) {
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.picture = latestUser.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Read the 'id' from the token and assign it to the session.user object
        session.user.id = token.id as string;
        session.user.name = token.name; 
        session.user.email = token.email as string; 
        session.user.image = token.picture;
      }
      return session;
    },
  },
};
