import { DOMParser } from "deno-dom";
import { Database } from "sqlite";

// --- Types matching response.json ---
interface Hit {
  name: string;
  meta: {
    id: number;
    url: string;
    created_at: string;
    updated_at: string;
    thumbnail?: { url: string; alt: string } | null;
  };
  card_data: {
    organization_id?: number;
    address: string;
  };
  objectID: string;
}

interface KindergartenData {
  name: string;
  url: string;
  objectId: string;
  organizationId: number | null;
  type: string | null;
  district: string | null;
  category: string | null;
  subcategory: string | null;
  address: string;
  postalCode: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  leaderName: string | null;
  ageRange: string | null;
  numChildren: number | null;
  indoorSpacePerChild: number | null;
  childrenPerEmployee: number | null;
  teacherEducationPct: number | null;
  monthlyTuition: number | null;
  monthlyFoodFee: number | null;
  latitude: number | null;
  longitude: number | null;
  thumbnailUrl: string | null;
  surveyResponseRate: number | null;
  surveyOverallSatisfaction: number | null;
  surveyChildWellbeing: number | null;
  surveyChildDevelopment: number | null;
  surveyEnvironment: number | null;
  surveyInformation: number | null;
  openingHoursFrom: string | null;
  openingHoursTo: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Parsing helpers ---

function parseNorwegianDecimal(text: string): number | null {
  const cleaned = text.replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function extractTextContent(el: Element | null): string {
  return el?.textContent?.trim().replace(/\s+/g, " ") ?? "";
}

function parsePage(html: string, hit: Hit): KindergartenData {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  const data: KindergartenData = {
    name: hit.name,
    url: hit.meta.url,
    objectId: hit.objectID,
    organizationId: hit.card_data.organization_id ?? null,
    type: null,
    district: null,
    category: null,
    subcategory: null,
    address: hit.card_data.address,
    postalCode: null,
    city: null,
    phone: null,
    email: null,
    website: null,
    leaderName: null,
    ageRange: null,
    numChildren: null,
    indoorSpacePerChild: null,
    childrenPerEmployee: null,
    teacherEducationPct: null,
    monthlyTuition: null,
    monthlyFoodFee: null,
    latitude: null,
    longitude: null,
    thumbnailUrl: hit.meta.thumbnail?.url ?? null,
    surveyResponseRate: null,
    surveyOverallSatisfaction: null,
    surveyChildWellbeing: null,
    surveyChildDevelopment: null,
    surveyEnvironment: null,
    surveyInformation: null,
    openingHoursFrom: null,
    openingHoursTo: null,
    createdAt: hit.meta.created_at,
    updatedAt: hit.meta.updated_at,
  };

  // Parse address parts from card_data.address (e.g. "Torvbakkgata 9, 0550 OSLO")
  const addrMatch = hit.card_data.address.match(/,\s*(\d{4})\s+(.+)$/);
  if (addrMatch) {
    data.postalCode = addrMatch[1];
    data.city = addrMatch[2];
  }

  // --- Nøkkelinformasjon list (type, district, category, age, num children) ---
  const h2s = doc.querySelectorAll("h2");
  for (const h2 of h2s) {
    const text = extractTextContent(h2 as Element);
    if (text.includes("Nøkkelinformasjon")) {
      const parent = (h2 as Element).parentElement;
      const lis = parent?.querySelectorAll("li");
      if (lis) {
        for (const li of lis) {
          const liText = extractTextContent(li as Element);
          if (liText.match(/^(Kommunal|Privat)$/i)) {
            data.type = liText;
          } else if (liText.startsWith("Bydel ")) {
            data.district = liText;
          } else if (
            liText.includes("barnehage") && !liText.includes("Antall")
          ) {
            if (!data.category) data.category = liText;
            else data.subcategory = liText;
          } else if (liText.includes("måneder") || liText.includes("år")) {
            data.ageRange = liText.replace(/\u00A0/g, " ").replace(
              /\u2013/g,
              "–",
            );
          } else if (liText.startsWith("Antall barn:")) {
            const num = liText.match(/(\d+)/);
            if (num) data.numChildren = parseInt(num[1]);
          }
        }
      }
      break;
    }
  }

  // --- Accordion stats (indoor space, children per employee, teacher education) ---
  const accordionItems = doc.querySelectorAll(".ods-accordion__item");
  for (const item of accordionItems) {
    const button = (item as Element).querySelector(".ods-accordion__trigger");
    const desc = (item as Element).querySelector(".ods-accordion__description");
    if (!button || !desc) continue;
    const label = extractTextContent(button as Element);
    const value = extractTextContent(desc as Element);

    if (label.includes("Inneareal")) {
      const match = value.match(/([\d,]+)\s*m²/);
      if (match) data.indoorSpacePerChild = parseNorwegianDecimal(match[1]);
    } else if (label.includes("barn per ansatt")) {
      data.childrenPerEmployee = parseNorwegianDecimal(value);
    } else if (label.includes("barnehagelærerutdanning")) {
      const match = value.match(/([\d,]+)\s*%/);
      if (match) data.teacherEducationPct = parseNorwegianDecimal(match[1]);
    }
  }

  // --- Survey table ---
  const tables = doc.querySelectorAll("table");
  for (const table of tables) {
    const rows = (table as Element).querySelectorAll("tbody tr");
    for (const row of rows) {
      const th = (row as Element).querySelector("th");
      const tds = (row as Element).querySelectorAll("td");
      if (!th || tds.length === 0) continue;
      const label = extractTextContent(th as Element);
      // Take the first column value (most recent year)
      const val = parseNorwegianDecimal(extractTextContent(tds[0] as Element));

      if (label.includes("Svarprosent")) {
        data.surveyResponseRate = val;
      } else if (label.includes("Total tilfredshet")) {
        data.surveyOverallSatisfaction = val;
      } else if (label.includes("trivsel")) {
        data.surveyChildWellbeing = val;
      } else if (label.includes("utvikling")) {
        data.surveyChildDevelopment = val;
      } else if (label.includes("miljø")) {
        data.surveyEnvironment = val;
      } else if (label.includes("Informasjon")) {
        data.surveyInformation = val;
      }
    }
  }

  // --- Pricing ---
  const contentDivs = doc.querySelectorAll(".ods-content");
  for (const div of contentDivs) {
    const text = extractTextContent(div as Element);
    if (text.includes("Pris for opphold")) {
      const tuitionMatch = text.match(/Pris for opphold:\s*(\d+)/);
      if (tuitionMatch) data.monthlyTuition = parseInt(tuitionMatch[1]);
      const foodMatch = text.match(/Pris for mat:\s*(\d+)/);
      if (foodMatch) data.monthlyFoodFee = parseInt(foodMatch[1]);
      break;
    }
  }

  // --- Leader contact info ---
  const contactSections = doc.querySelectorAll(".ods-contactpoint");
  for (const section of contactSections) {
    const heading = (section as Element).querySelector(
      ".ods-contactpoint__heading",
    );
    if (heading && extractTextContent(heading as Element).includes("leder")) {
      const groups = (section as Element).querySelectorAll(
        ".ods-contactpoint__group",
      );
      for (const group of groups) {
        const label = extractTextContent(
          (group as Element).querySelector(
            ".ods-contactpoint__label",
          ) as Element,
        );
        const value = extractTextContent(
          (group as Element).querySelector(
            ".ods-contactpoint__value",
          ) as Element,
        );
        if (label === "Kontaktperson") data.leaderName = value;
        else if (label === "E-post") data.email = value;
        else if (label === "Telefon" && !data.phone) data.phone = value;
      }
      break;
    }
  }

  // --- Phone from contactbox (sidebar) ---
  const contactboxGroups = doc.querySelectorAll(".ods-contactbox__group");
  for (const group of contactboxGroups) {
    const label = extractTextContent(
      (group as Element).querySelector(".ods-contactbox__label") as Element,
    );
    const value = extractTextContent(
      (group as Element).querySelector(".ods-contactbox__value") as Element,
    );
    if (label === "Telefon" && !data.phone) {
      data.phone = value;
    }
  }

  // --- Coordinates from ods-map :state attribute ---
  const odsMap = doc.querySelector("ods-map");
  if (odsMap) {
    const stateAttr = (odsMap as Element).getAttribute(":state") ??
      (odsMap as Element).getAttribute("v-bind:state");
    if (stateAttr) {
      try {
        const state = JSON.parse(stateAttr.replace(/&quot;/g, '"'));
        if (state.latitude) data.latitude = parseFloat(state.latitude);
        if (state.longitude) data.longitude = parseFloat(state.longitude);
      } catch { /* ignore parse errors */ }
    }
  }

  // --- Website (external link for private kindergartens) ---
  const allLinks = doc.querySelectorAll("a.ods-link");
  for (const link of allLinks) {
    const href = (link as Element).getAttribute("href") ?? "";
    if (
      href.startsWith("http") &&
      !href.includes("oslo.kommune.no") &&
      !href.includes("barnehagefakta") &&
      !href.includes("udir.no") &&
      !href.includes("mailto:") &&
      !href.includes("tel:")
    ) {
      data.website = href;
      break;
    }
  }

  // --- Opening hours ---
  const timeEls = doc.querySelectorAll("time[data-ods-dat-from]");
  if (timeEls.length > 0) {
    const firstTime = timeEls[0] as Element;
    const from = firstTime.getAttribute("data-ods-dat-from");
    const to = firstTime.getAttribute("data-ods-dat-to");
    if (from && to) {
      // Extract just the time part (HH:MM)
      const fromMatch = from.match(/T(\d{2}:\d{2})/);
      const toMatch = to.match(/T(\d{2}:\d{2})/);
      if (fromMatch) data.openingHoursFrom = fromMatch[1];
      if (toMatch) data.openingHoursTo = toMatch[1];
    }
  }

  return data;
}

// --- Database setup ---

function createDatabase(dbPath: string): Database {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS kindergartens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      object_id TEXT,
      organization_id INTEGER,
      type TEXT,
      district TEXT,
      category TEXT,
      subcategory TEXT,
      address TEXT,
      postal_code TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      leader_name TEXT,
      age_range TEXT,
      num_children INTEGER,
      indoor_space_per_child REAL,
      children_per_employee REAL,
      teacher_education_pct REAL,
      monthly_tuition INTEGER,
      monthly_food_fee INTEGER,
      latitude REAL,
      longitude REAL,
      thumbnail_url TEXT,
      survey_response_rate REAL,
      survey_overall_satisfaction REAL,
      survey_child_wellbeing REAL,
      survey_child_development REAL,
      survey_environment REAL,
      survey_information REAL,
      opening_hours_from TEXT,
      opening_hours_to TEXT,
      created_at TEXT,
      updated_at TEXT
    )
  `);
  return db;
}

function insertKindergarten(db: Database, data: KindergartenData) {
  db.exec(
    `INSERT OR REPLACE INTO kindergartens (
      name, url, object_id, organization_id, type, district, category, subcategory,
      address, postal_code, city, phone, email, website, leader_name, age_range,
      num_children, indoor_space_per_child, children_per_employee, teacher_education_pct,
      monthly_tuition, monthly_food_fee, latitude, longitude, thumbnail_url,
      survey_response_rate, survey_overall_satisfaction, survey_child_wellbeing,
      survey_child_development, survey_environment, survey_information,
      opening_hours_from, opening_hours_to, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?
    )`,
    [
      data.name,
      data.url,
      data.objectId,
      data.organizationId,
      data.type,
      data.district,
      data.category,
      data.subcategory,
      data.address,
      data.postalCode,
      data.city,
      data.phone,
      data.email,
      data.website,
      data.leaderName,
      data.ageRange,
      data.numChildren,
      data.indoorSpacePerChild,
      data.childrenPerEmployee,
      data.teacherEducationPct,
      data.monthlyTuition,
      data.monthlyFoodFee,
      data.latitude,
      data.longitude,
      data.thumbnailUrl,
      data.surveyResponseRate,
      data.surveyOverallSatisfaction,
      data.surveyChildWellbeing,
      data.surveyChildDevelopment,
      data.surveyEnvironment,
      data.surveyInformation,
      data.openingHoursFrom,
      data.openingHoursTo,
      data.createdAt,
      data.updatedAt,
    ],
  );
}

// --- Fetch with retry ---

async function fetchWithRetry(
  url: string,
  retries = 1,
): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; barnehage-scraper/1.0; educational project)",
        },
      });
      if (!resp.ok) {
        console.error(`  HTTP ${resp.status} for ${url}`);
        if (attempt < retries) {
          await delay(2000);
          continue;
        }
        return null;
      }
      return await resp.text();
    } catch (err) {
      console.error(`  Fetch error for ${url}: ${err}`);
      if (attempt < retries) {
        await delay(2000);
        continue;
      }
      return null;
    }
  }
  return null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Main ---

async function main() {
  const responseData = JSON.parse(
    await Deno.readTextFile("response.json"),
  );
  const hits: Hit[] = responseData.hits;

  console.log(`Found ${hits.length} kindergartens to scrape`);

  const db = createDatabase("barnehager.db");
  let success = 0;
  let failed = 0;
  const failures: string[] = [];

  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const progress = `[${i + 1}/${hits.length}]`;

    console.log(`${progress} Scraping: ${hit.name}`);

    const html = await fetchWithRetry(hit.meta.url);
    if (!html) {
      console.error(`${progress} FAILED: Could not fetch ${hit.meta.url}`);
      failed++;
      failures.push(hit.name);
      continue;
    }

    try {
      const data = parsePage(html, hit);
      insertKindergarten(db, data);
      const coords = data.latitude && data.longitude
        ? `(${data.latitude}, ${data.longitude})`
        : "(no coords)";
      console.log(
        `${progress} OK: ${data.name} - ${data.type ?? "?"} - ${
          data.district ?? "?"
        } ${coords}`,
      );
      success++;
    } catch (err) {
      console.error(`${progress} PARSE ERROR for ${hit.name}: ${err}`);
      failed++;
      failures.push(hit.name);
    }

    // Be respectful - 500ms between requests
    if (i < hits.length - 1) {
      await delay(500);
    }
  }

  db.close();

  console.log("\n--- Summary ---");
  console.log(`Total: ${hits.length}`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`Failures: ${failures.join(", ")}`);
  }
  console.log(`Database saved to: barnehager.db`);
}

main();
