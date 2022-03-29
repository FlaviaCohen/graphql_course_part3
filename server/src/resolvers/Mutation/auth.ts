import { User } from "@prisma/client";
import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

interface SignupArgs {
  credentials: { email: string; password: string };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: { email: string; password: string };
}

interface UserPayloadType {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayloadType> => {
    const { email, password } = credentials;
    const isEmail = validator.isEmail(email);
    // with default options password must have at least 1 uppercase, 1 lowercase, 1 number, 1 symbol and min length of 8
    const isValidPassword = validator.isStrongPassword(password);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "The email you entered is invalid",
          },
        ],
        token: null,
      };
    }

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "The password you entered is not strong enough",
          },
        ],
        token: null,
      };
    }

    // second param is the number of characters appended or preppended (salt)
    const hashPassword = await bcrypt.hash(password, 10);

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
      },
      process.env.JSON_SIGNATURE as string,
      { expiresIn: 3600000 }
    );

    return {
      userErrors: [],
      token,
    };
  },

  signin: async (
    _: any,
    { credentials }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayloadType> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        userErrors: [{ message: "Invalid credentials" }],
        token: null,
      };
    }

    // bcrypt.compare returns true if password and hashed password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [{ message: "Invalid credentials" }],
        token: null,
      };
    }

    const token = await JWT.sign(
      {
        userId: user.id,
      },
      process.env.JSON_SIGNATURE as string,
      { expiresIn: 3600000 }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
