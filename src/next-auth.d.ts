// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the User type to include the ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email:string ;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email:string;
  }
}

// Extend the JWT type to include the ID
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}