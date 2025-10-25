import { email, z, ZodObject } from "zod"

const CreateUserSchema = z.object({
    username: z.string().min(
        1, {
        message: "Username is required"
    }
    ),

    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Email must be a valid email address" }),

    name: z.string().min(
        1, {
        message: "Username is required"
    }
    ),
})

export class CreateUserDto {
    static schema: ZodObject<any> = CreateUserSchema

    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly name: string
    ) { }

}