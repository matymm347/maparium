import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-background pt-30 pb-12 text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[8%] h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-8 left-[10%] h-72 w-72 rounded-full bg-accent/35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-[min(100%-2rem,72rem)] flex-col gap-8">
        <section className="rounded-2xl border border-border/80 bg-card/85 p-6 shadow-lg backdrop-blur-sm md:p-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <div className="mb-6 flex justify-end gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to map
              </Link>
            </Button>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl border border-border/80 bg-background/80 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Privacy Policy
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                This page explains what Maparium stores, what external services
                it uses, and what happens when you interact with map features.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: 15 March 2026
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold md:text-2xl">
              Who operates this website
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Maparium is operated by Mateusz Jochimiak. If you need to contact
              the website operator about privacy matters, add your preferred
              contact email here before publishing this page.
            </p>
          </article>

          <article className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-75">
            <h2 className="text-xl font-semibold md:text-2xl">No accounts</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Maparium does not currently require registration, login, or user
              profiles. The website is intended for public browsing and map
              exploration.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-100">
          <div className="grid gap-6 md:grid-cols-2">
            <article>
              <h2 className="text-xl font-semibold md:text-2xl">
                Cookies and browser storage
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Maparium does not use cookies for advertising or cross-site
                tracking. The website may store a small theme preference in your
                browser so it can remember whether you prefer light or dark
                mode. This is stored in browser local storage, not in a cookie.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-semibold md:text-2xl">Analytics</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Maparium uses
                <a
                  href="https://umami.is/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Umami
                </a>{" "}
                analytics to understand general website usage, such as page
                views, device type, browser, and broad usage patterns. Umami
                does not collect any personally identifiable information and
                anonymizes all data collected.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-semibold md:text-2xl">Server logs</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Like most websites, the hosting and server infrastructure may
                process technical request data such as IP address, requested
                URL, date and time, browser information, and error logs. This is
                used for security, troubleshooting, performance, and normal site
                operation.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-semibold md:text-2xl">
                Third-party services
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Some features may connect your browser to third-party services.
                Search may use{" "}
                <a
                  href="https://www.maptiler.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  MapTiler
                </a>{" "}
                geocoding . Feature details may load data or images from
                <a
                  href="https://www.wikidata.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Wikidata
                </a>{" "}
                and
                <a
                  href="https://www.wikimedia.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Wikimedia Commons
                </a>
                . When you use those features, your browser may send normal
                request metadata to those services as part of the web request.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-150">
          <div className="grid gap-6 md:grid-cols-2">
            <article>
              <h2 className="text-xl font-semibold md:text-2xl">Geolocation</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If you use the geolocation feature in the map, your browser may
                ask for permission to access your device location. Your location
                is only used after you grant that permission.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-semibold md:text-2xl">Your rights</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Depending on the laws that apply to you, you may have rights to
                request access, correction, deletion, restriction, or objection
                regarding personal data processing. Privacy questions can be
                directed to the contact address you publish for this website.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
