import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-15"></h1>
      <SignIn />
    </div>
  );
}
