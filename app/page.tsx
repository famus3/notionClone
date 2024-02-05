import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./components/ThemeToggle";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) {
    return redirect("/dashboard");
  }

  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Sort your notes, with ease.
              </span>
            </span>

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Casually Create Notes 📝
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-f">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex justify-center max-w-sm mx-auto mt-10">
              <RegisterLink>
                <Button size="lg" className="w-full">
                  Sign Up For Free
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
