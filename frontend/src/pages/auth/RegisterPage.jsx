import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import useRegister from "@/hooks/useRegister"
import { Label } from "@radix-ui/react-label"
import { LoaderCircle } from "lucide-react"
import { useRef } from "react"
import { Link } from "react-router-dom"

function RegisterPage() {

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const addressRef = useRef(null);

  const registerMutation = useRegister();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const address = addressRef.current?.value;

    if (!name || !email || !password || !address) return alert('Please fill out all fields: name, email, password and address.');

    registerMutation.mutate({ name, email, password, address });
  }

  return (
    <section className='flex justify-center items-center h-screen'>
      <Card className="mx-auto max-w-md space-y-2 w-1/4">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Enter your information to create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleRegisterSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input ref={nameRef} id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input ref={emailRef} id="email" type="email" placeholder="example@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input ref={passwordRef} id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                ref={addressRef}
                id="address"
                placeholder="123 Main St, City, Country"
                required
                maxLength={400}
                className="max-h-40 resize-y"
              />
            </div>
            {registerMutation.isError && <span className='text-red-500 text-sm'>{registerMutation.error.message}</span>}
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              <LoaderCircle className={registerMutation.isPending ? 'animate-spin' : "hidden"} />
              <span>Create an account</span>
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to={'/auth/login'} className="underline">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default RegisterPage