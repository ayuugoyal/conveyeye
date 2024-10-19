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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
    // const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get("callbackUrl");
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
            // signIn("credentials", {
            //     email: data.email,
            //     callbackUrl: callbackUrl ?? "/dashboard",
            // });
            toast.success("Signed In Successfully!");
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
                        Continue With Email
                    </Button>
                </form>
            </Form>
        </>
    );
}
