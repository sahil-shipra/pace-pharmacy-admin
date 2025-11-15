import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"
import z from 'zod'
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/auth/auth-context";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const formSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

type Inputs = z.infer<typeof formSchema>;

function LoginComponent() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { signIn, user, loading } = useAuth()

    const { mutate: callLogin, isPending } = useMutation({
        mutationFn: (data: Inputs) => signIn(data.email, data.password),
        onSuccess: () => {
            navigate({ to: '/dashboard' })
        },
        onError: (res) => {
            if (isAxiosError(res)) {
                toast.error(res.response?.data?.error)
            } else {
                toast.error(res.message)
            }
        }
    })

    const methods = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: ''
        }
    })



    const onSubmit = (data: Inputs) => {
        callLogin(data);
    };

    if (loading) {
        return <div className='h-svh w-full bg-theme-green-50/50 flex justify-center items-center'>
            <Loader2 className='animate-spin size-10' />
        </div>
    }

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <section className='bg-theme-green-50 h-svh'>
            <div className="flex justify-between items-start">
                <div className="min-h-20 flex justify-start items-center w-fit py-16 pl-10">
                    <img
                        src="/logo.png"
                        alt="pace-pharmacy-logo"
                        className="h-18 w-fit"
                        loading="lazy"
                    />
                </div>


                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white my-12 mr-12 rounded-[40px] h-[calc(100dvh-100px)]">
                    <div className="w-full max-w-md">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Welcome to<br />Pace Pharmacy</h2>
                                <p className="text-sm text-gray-600">Enter your credentials to manage pharmacy licenses and applications</p>
                            </div>

                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className="space-y-4">

                                    <Controller
                                        name="email"
                                        control={methods.control}
                                        rules={{
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="gap-0">
                                                <FieldLabel htmlFor="email" className="text-xl">
                                                    Enter your Email Address
                                                </FieldLabel>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    className="h-12 md:text-lg"
                                                    placeholder="your@email.com"
                                                    {...field}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="password"
                                        control={methods.control}
                                        rules={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="gap-0">
                                                <FieldLabel htmlFor="password" className="text-xl">
                                                    Enter your password
                                                </FieldLabel>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        className="h-12 md:text-lg pr-10"
                                                        placeholder="••••••••"
                                                        autoComplete="off"
                                                        {...field}
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-theme-green hover:bg-green-900 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6 cursor-pointer h-12"
                                    >
                                        {isPending ? <Loader2 className="animate-spin" /> : `Login`}
                                    </Button>
                                </div>
                            </form>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                By clicking continue, you agree to our{' '}
                                <a href="#" className="text-gray-900 hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-gray-900 hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginComponent