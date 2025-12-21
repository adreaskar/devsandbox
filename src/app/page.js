import { Navbar } from "@/components/Navbar";
import Window from "@/components/Window";
import {
  Terminal,
  Zap,
  Shield,
  GitBranch,
  Code2,
  Rocket,
  Database,
  ChartCandlestick,
  Globe,
  FileCodeCorner,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="overflow-hidden">
        <div className="container py-24 md:py-32 relative z-10 grid lg:grid-cols-2 gap-10">
          <div className="space-y-18 text-left ">
            <div className="flex font-mono gap-2 text-sm mb-5">
              <span className="size-2 rounded-full bg-accent my-auto" />
              <span>THE VISION</span>
            </div>
            <h1 className="text-5xl xl:text-7xl">
              Code Anywhere,
              <span className="block">Deploy Instantly</span>
            </h1>
            <p className="font-mono text-xl text-muted-foreground max-w-2xl ">
              Isolated, cloud-based dev environments in seconds.
              <br />
              No setup, no configuration, just code.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-end justify-end ">
            <Window title="My Workspaces">
              <div className="grid grid-cols-5 gap-4 mt-3">
                <div className="inline-flex p-3 rounded-lg border-2 border-border mb-4 hover:scale-110 duration-300 transition-transform">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="inline-flex p-3 rounded-lg border-2 border-border mb-4 hover:scale-110 duration-300 transition-transform">
                  <FileCodeCorner className="w-8 h-8" />
                </div>
                <div className="inline-flex p-3 rounded-lg border-2 border-border mb-4 hover:scale-110 duration-300 transition-transform">
                  <Database className="w-8 h-8" />
                </div>
                <div className="inline-flex p-3 rounded-lg border-2 border-border mb-4 hover:scale-110 duration-300 transition-transform">
                  <ChartCandlestick className="w-8 h-8" />
                </div>
                <div className="inline-flex p-3 rounded-lg border-2 border-border mb-4 hover:scale-110 duration-300 transition-transform">
                  <GitBranch className="w-8 h-8" />
                </div>
              </div>

              <div className="flex gap-3 mt-3 items-center">
                <span className="size-2 rounded-full bg-accent my-auto" />
                <p className="text-muted-foreground font-mono">
                  All your workspaces, ready to code
                </p>
              </div>
            </Window>
            <p className="text-muted-foreground/50 font-mono">
              devsandbox.io - {new Date().toISOString().split("T")[0]}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 cross">
        <div className="container">
          <hr className="pb-7 opacity-70" />

          <div className="flex font-mono gap-2 text-sm mb-10">
            <span className="size-2 rounded-full bg-accent my-auto" />
            <span>THE DETAILS</span>
          </div>

          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Everything you need to build faster, no excuses
            </h2>
            <p className="text-lg text-muted-foreground font-mono max-w-2xl">
              Full-featured development environments with built-in tools and
              integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Terminal className="w-8 h-8" />}
              title="Web-based IDE"
              description="VS Code-powered editor accessible from any browser"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Startup"
              description="Launch containerized environments in under 10 seconds"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Isolated"
              description="Each workspace runs in its own secure containerized environment"
            />
            <FeatureCard
              icon={<GitBranch className="w-8 h-8" />}
              title="Git Integration"
              description="Clone repos, push changes, and manage branches directly"
            />
            <FeatureCard
              icon={<Code2 className="w-8 h-8" />}
              title="Multi-Language"
              description="Support for Node.js, Python, Go, Rust, Java, and more"
            />
            <FeatureCard
              icon={<Rocket className="w-8 h-8" />}
              title="Auto-Scaling"
              description="Resources scale automatically based on your workload"
            />
          </div>

          <div className="flex font-mono gap-2 text-sm mt-12">
            <span className="size-2 rounded-full bg-accent my-auto" />
            <span className="text-muted-foreground">
              $ git commit -m "all in one product?"
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section>
        <div className="container pt-16 mb-16 gap-10 grid md:grid-cols-2">
          <div className="text-left bg-white rounded-2xl py-7 px-10 ">
            <div className="flex font-mono gap-2 text-sm mb-10">
              <span className="size-2 rounded-full bg-accent my-auto" />
              <span className="text-black">LETS BUILD</span>
            </div>

            <div className="inline-flex p-3 rounded-md bg-muted/90 mt-24 mb-7">
              <div className="text-white">
                <Terminal className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl text-muted/90 ">
              Ready to supercharge your workflow?
            </h2>
          </div>

          <div className="h-full md:ml-auto max-w-md w-full">
            <div className="flex font-mono gap-2 text-sm mb-5">
              <span className="size-2 rounded-full bg-accent my-auto" />
              <span>GET EXCLUSIVE EARLY ACCES</span>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="pt-10 pb-15">
        <div className="container">
          <div className="flex flex-col rounded-2xl px-12 py-7 text-left space-y-10 bg-muted">
            <div className="flex font-mono gap-2 text-sm mb-8">
              <span className="size-2 rounded-full bg-accent my-auto" />
              <span>FOOTER</span>
            </div>

            <div className="text-sm md:w-1/2 text-right self-end">
              <p className="text-muted-foreground font-mono">
                Design isn't just what it looks and feels like
                <br />
                Design is how it works
                <br />
                -- <i className="text-muted-foreground">Steve Jobs</i>{" "}
              </p>
            </div>

            <div className="flex text-xs items-end justify-end md:text-sm font-mono text-muted-foreground">
              <Image
                src="/img/logonegative.png"
                alt="DevSandbox Logo"
                width={45}
                height={45}
                className="mr-auto hidden md:block"
              />
              <span className="mx-3 md:mx-5"></span>
              <a
                className="text-accent"
                href="https://linkedin.com/in/andreas-karabetian/"
                target="_blank"
              >
                LinkedIn
              </a>
              <span className="mx-1 md:mx-1.5"></span>
              <a
                className="text-accent"
                href="https://github.com/adreaskar"
                target="_blank"
              >
                GitHub
              </a>
              <span className="mx-3 md:mx-5"></span>
              <p>DevSandbox {new Date().getFullYear()} </p>
              <span className="hidden md:block md:mx-1"></span>
              <a
                className="text-accent hidden md:block"
                href="https://karabetian.dev"
                target="_blank"
              >
                karabetian.dev
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="border-border border bg-card p-6 rounded-md hover:shadow-lg transition-all duration-300 group">
      <div className="inline-flex p-3 rounded-md bg-accent mb-4 group-hover:scale-110 transition-transform">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground font-mono">{description}</p>
    </div>
  );
};

export default Home;
