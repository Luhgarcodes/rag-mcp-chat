import {createEnv} from "@t3-oss/env-core";
import * as z from "zod";

export const envConfig = createEnv({
    server:{
        DB_NAME: z.string().min(1),
        DB_HOST: z.string().min(1),
        DB_PORT: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_PASSWORD: z.string().min(1),
        DATABASE_URL: z.string().min(1),
        DB_SSL: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1)
    },
    runtimeEnv: {
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DATABASE_URL: process.env.DATABASE_URL,
        DB_SSL: process.env.DB_SSL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
    },
    onValidationError:(error)=>{
        console.error("Environment validation error:", error);
        throw new Error("Environment validation failed");
    },
    onInvalidAccess:(variable:string)=>{
        throw new Error(`Invalid access to environment variable: ${variable}`);
    }
})