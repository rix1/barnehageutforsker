import NavLinks from "../islands/NavLinks.tsx";
import { define } from "../utils.ts";

export default define.page(function App({ Component, url }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Barnehager i Oslo</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body class="bg-oslo-bg min-h-screen">
        <nav class="bg-oslo-navy">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14">
              <a href="/" class="flex items-center gap-2">
                <span class="text-white font-semibold text-lg tracking-tight">
                  Barnehager i Oslo
                </span>
              </a>
              <NavLinks currentPath={url.pathname} />
            </div>
          </div>
        </nav>
        <Component />
      </body>
    </html>
  );
});
