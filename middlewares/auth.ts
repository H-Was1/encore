import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import jwt from 'jsonwebtoken';

interface AuthParams {
  authorization: Header<"Authorization">;
}

export const jwt_secret = "xQXA/P91LFt9QYCR3/UayYhyxlt8C4ki9Ok62Trj9oY=";

// The function passed to authHandler will be called for all incoming API call that requires authentication.
export const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<{ userID: string }> => {
    const isInvalidUser =
      params.authorization === undefined || !params.authorization;

    if (isInvalidUser) {
      throw APIError.unauthenticated("Invalid user ID or Token is missing");
    }

    try {
      const decoded = await jwt.verify(params.authorization, jwt_secret);
      console.log("Token is valid:", decoded);
      return { userID: decoded.sub as string };
    } catch (error: any) {
      console.error("Token verification failed:", error);
      throw APIError.unauthenticated(error.message);
    }
  }
);

export const gateway = new Gateway({ authHandler: myAuthHandler });

//   generate jwt token function


export const generateJWT = (userId: string): string => {
    const token = jwt.sign(
      {
        iss: "RosenheimBookingApiServer",
        sub: userId,
        iat: Math.floor(Date.now() / 1000), // Issue at time in seconds
        exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // Expiration time in seconds (365 days)
      },
      jwt_secret
    );
    return token;
  };