import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Terminal, Zap, Shield, GitBranch, Code2, Rocket } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen`">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/cloudbg-min.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "opacity(0.4)",
          }}
        />
        <div className="container py-24 md:py-32 relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex font-mono items-center gap-2 px-4 py-2 rounded-full glass-card text-sm">
              <Zap className="w-4 h-4 text-accent" />
              <span>Instant cloud dev environments</span>
            </div>

            <h1 className="text-5xl md:text-7xl tracking-tight">
              Code Anywhere,
              <span className="text-accent block">Deploy Instantly</span>
            </h1>

            <p className="font-mono text-xl text-muted-foreground max-w-2xl mx-auto">
              Isolated, cloud-based dev environments in seconds.
              <br />
              No setup, no configuration, just code.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/overview">
                <Button variant="hero" size="lg" className="gap-2 font-mono">
                  <Rocket className="w-5 h-5" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Everything you need to{" "}
              <span className="text-accent">build faster</span>
            </h2>
            <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
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
              description="Each workspace runs in its own secure Kubernetes pod"
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="glass-card rounded-2xl p-12 text-center space-y-6 animate-glow">
            <h2 className="text-3xl md:text-5xl font-medium">
              Ready to supercharge your workflow?
            </h2>
            <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
              Join thousands of developers building faster with DevSandbox
            </p>
            <Link href="/overview">
              <Button variant="hero" size="lg" className="gap-2 font-mono">
                <Terminal className="w-5 h-5" />
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="container pb-7 text-center text-sm font-mono text-muted-foreground">
          DevSandbox &copy; {new Date().getFullYear()} |{" "}
          <a
            className="text-accent"
            href="https://karabetian.dev"
            target="_blank"
          >
            karabetian.dev
          </a>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
      <div className="inline-flex p-3 rounded-lg bg-accent mb-4 group-hover:scale-110 transition-transform">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground font-mono">{description}</p>
    </div>
  );
};

export default Home;
