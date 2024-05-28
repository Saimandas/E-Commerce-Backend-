import { z } from "zod";
const username = z
  .string()
  .min(2, "Username must have at least two characters")
  .max(12, "Username cannot exceed 12 characters")
  .regex(
    /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/,
    "Username cannot contain special characters or spaces, and cannot have consecutive periods, hyphens, or underscores"
  );

const signUpSchema = z.object({
  username,
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, and no spaces"
    ),
});

export { signUpSchema };
