import Link from "next/link";
import { Shield, Briefcase, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const tracks = [
  {
    title: "Freelancer",
    description: "Service agreements, NDAs, payment terms, and more for independent professionals.",
    icon: Briefcase,
    color: "text-brand-teal",
    bgColor: "bg-brand-teal/10",
  },
  {
    title: "Startup / SME",
    description: "Shareholder agreements, employment contracts, and legal docs for growing businesses.",
    icon: Rocket,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    title: "Creator",
    description: "Brand deals, content licenses, and collaboration agreements for influencers.",
    icon: Users,
    color: "text-brand-green",
    bgColor: "bg-brand-green/10",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-blue to-brand-green flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-dark">ClauseGuard</span>
            <span className="text-xs font-medium text-brand-teal ml-1 tracking-wider">AFRICA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-linear-to-b from-brand-gray/50 to-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-4">
              Protect your work. Get paid.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Africa's legal document platform — AI-generated, jurisdiction-aware contracts in plain English.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Generate your first contract in under 4 minutes
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-dark text-center mb-12">
              Choose your track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <div
                  key={track.title}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${track.bgColor} flex items-center justify-center mb-4`}>
                    <track.icon className={`w-6 h-6 ${track.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">{track.title}</h3>
                  <p className="text-gray-600 text-sm">{track.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-gray py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p className="mb-2">
            ⚠️ ClauseGuard is not a law firm. Documents are AI-generated for informational purposes only.
          </p>
          <p>© {new Date().getFullYear()} ClauseGuard Africa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}