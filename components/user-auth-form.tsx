"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
    const router = useRouter();

    const [loading, startTransition] = useTransition();
    const defaultValues = {
        email: "",
        password: "",
    };
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: UserFormValue) => {
        startTransition(() => {
            console.log(data);
            console.log(process.env.NEXT_PUBLIC_EMAIL);
            if (
                data.email === process.env.NEXT_PUBLIC_EMAIL &&
                data.password === process.env.NEXT_PUBLIC_PASSWORD
            ) {
                Cookies.set(
                    "token",
                    process.env.NEXT_PUBLIC_TOKEN || "nothing",
                    {
                        expires: 7,
                    }
                );

                console.log("Signed In Successfully!");
                toast.success("Signed In Successfully!");
                router.push("/dashboard");
            } else {
                toast.error("Invalid Credentials");
            }
        });
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email..."
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={loading}
                        className="ml-auto pt-2 w-full"
                        type="submit"
                    >
                        Continue With ConveyorEye
                    </Button>
                </form>
            </Form>
        </>
    );
}
