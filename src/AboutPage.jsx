import { ArrowLeft, Layers, Server, Shield, Sparkles } from "lucide-react";
import githubInvertocatWhite from "@/assets/GitHub_Invertocat_White.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-background pt-30 pb-12 text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[8%] h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-8 right-[10%] h-72 w-72 rounded-full bg-accent/35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-[min(100%-2rem,72rem)] flex-col gap-12">
        <section className="rounded-2xl border border-border/80 bg-card/85 p-6 shadow-lg backdrop-blur-sm md:p-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs tracking-[0.14em] uppercase text-muted-foreground">
              About Maparium
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to map
              </Link>
            </Button>
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Viewing OpenStreetMap features on a global scale
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Idea: making large, interesting OpenStreetMap datasets feel
            immediate and clear when exploring the whole globe.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold md:text-2xl">The project</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Maparium was created for experimentation, learning, and visual
              discovery. Instead of showing everything at once, it curates
              feature categories such as power, transport, history, and geology
              into dedicated layers.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              The goal is simple: open the map, select a feature type that
              interests you, and immediately discover patterns that are hard to
              notice on a typical map.
            </p>
          </article>

          <article className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-75">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <h2 className="text-xl font-semibold md:text-2xl">About me</h2>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Hi, Mateusz Jochimiak here. I built Maparium as an independent
              side project to combine cartography, data processing, and web
              development into one playful product. There is something
              fascinating about how much of our world is represented in
              OpenStreetMap, and I wanted to create a tool that makes it easy to
              explore and appreciate this incredible dataset.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-100">
          <h2 className="text-xl font-semibold md:text-2xl">
            OK, so how it works
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Viewing features on a global scale is challenging due to the amount
            of data that has to be sent to the client and general performance
            considerations. On a typical web map service, features are dropped
            when zooming out to maintain performance. I had to find a way to
            keep as many features visible as possible while keeping tile sizes
            manageable.
          </p>
          <br />
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The first idea was to convert all polygons and multipolygons into
            their representative centroid points. At a global scale, almost all
            polygons become indistinguishable from points anyway. In addition,
            polygon features often simply disappear on large-scale maps, so
            representing them as points becomes a better way of showing that
            data. This approach gives a clear global view and reduced dataset
            size.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The second step is removing all tags that are not needed for this
            project. Maparium currently uses only the
            <span className="m-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              name
            </span>
            ,
            <span className="m-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              wikidata
            </span>
            , and
            <span className="m-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              wikipedia
            </span>
            tags. Cutting unnecessary tags saves even more space and allows even
            more features to fit into a single tile.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-border/70 bg-background/70 p-4">
              <div className="mb-3 inline-flex rounded-lg border border-border/80 bg-card p-2 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold">Data collection</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The data source is the weekly planet .pbf extract of
                OpenStreetMap data from
                <a
                  href="https://planet.openstreetmap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Planet OSM
                </a>
                . Basemap is a zoom 12 extract from
                <a
                  href="https://protomaps.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Protomaps
                </a>
                .
              </p>
            </article>

            <article className="rounded-xl border border-border/70 bg-background/70 p-4">
              <div className="mb-3 inline-flex rounded-lg border border-border/80 bg-card p-2 text-primary">
                <Server className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold">Tile pipeline</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The extracted .pbf file is filtered with{" "}
                <a
                  href="https://osmcode.org/osmium-tool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Osmium Tool
                </a>{" "}
                and postprocessed (dropping tags and converting polygons and
                multipolygons to centroids). After postprocessing, tiles are
                generated with{" "}
                <a
                  href="https://github.com/mapbox/tippecanoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Tippecanoe
                </a>
                . The prepared tile files are served with the
                <a
                  href="https://maplibre.org/martin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  Martin
                </a>{" "}
                tile server.
              </p>
            </article>

            <article className="rounded-xl border border-border/70 bg-background/70 p-4">
              <div className="mb-3 inline-flex rounded-lg border border-border/80 bg-card p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold">Interactive map</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Maparium combines these tiles with a clean UI, search
                functionality, and category-driven discovery built on top of{" "}
                <a
                  href="https://maplibre.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2"
                >
                  MapLibre
                </a>
                .
              </p>
            </article>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-150">
          <div>
            <h2 className="text-xl font-semibold">What is next?</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              I want Maparium to be open for user contributions and experiments.
              Users would be able to choose any tag combination and share it
              with others. This would allow to discover and share interesting
              patterns in OpenStreetMap data that are not covered by default
              layers. Another big thing would be to move from centralized tile
              server to serverless architecture with pmtiles for better scaling.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/matymm347/maparium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={githubInvertocatWhite}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 invert dark:invert-0"
                />
                Repository
              </a>
            </Button>
          </div>
        </section>

        <footer className="flex justify-center pt-2 pb-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-200">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/privacy">
              <Shield className="h-4 w-4" />
              Privacy policy
            </Link>
          </Button>
        </footer>
      </div>
    </main>
  );
}
