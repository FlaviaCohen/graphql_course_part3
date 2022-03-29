import JWT from "jsonwebtoken";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, process.env.JSON_SIGNATURE as string) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
};
