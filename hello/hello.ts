import { api, APIError } from "encore.dev/api";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { generateJWT } from "../middlewares/auth";

export const hello = api(
  { expose: true, method: "GET", path: "/api/v1" },
  async (): Promise<Response> => {
    return { message: `Hello !` };
  }
);

export const register = api(
  { expose: true, method: "POST", path: "/auth" },
  async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<Response> => {
    const [user] = await db
      .insert(UserTable)
      .values({
        name,
        email,
      })
      .returning();
    let token = generateJWT(user.id);
    return { message: `Hello ${user?.name}!, you have been registered`, token };
  }
);

interface Response {
  message: string;
  token?: string;
}

// Auth endpoint example
export const dashboardEndpoint = api(
  // Setting auth to true will require the user to be authenticated
  { auth: true, method: "GET", path: "/dashboard/:id" },
  async ({
    id,
  }: {
    id: string;
  }): Promise<{
    message?: string;
  }> => {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, id),
    });
    if (!user) {
      throw APIError.notFound("User not found");
    }
    return {
      message: "Secret dashboard message",
    };
  }
);
