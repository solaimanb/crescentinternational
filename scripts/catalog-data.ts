import { category, product, siteSetting } from "../src/lib/catalog-schema";
import type { ContactContent, FooterContent, HomeContent } from "../src/lib/content/types";

type CategoryInsert = typeof category.$inferInsert;
type ProductInsert = typeof product.$inferInsert;
type SettingInsert = typeof siteSetting.$inferInsert;

const SALES_WHATSAPP = "+880 1713-445566";
const SALES_PHONE = "+880 1713-445566";
const OFFICE_PHONE = "+880 2-8876-1122";
const SALES_EMAIL = "sales@crescentinternational.com";
const INFO_EMAIL = "info@crescentinternational.com";
const ADDRESS = "Plot 14, Road 3, Tejgaon Industrial Area, Dhaka 1208, Bangladesh";

const home: HomeContent = {
  bannerTitle: "Factory machinery supplied from Dhaka",
  bannerSubtitle:
    "Hydraulic packs, industrial mixers, aggregate plant, food-grade process lines, handling equipment, and packaging machines for plants across Bangladesh.",
  bannerImage:
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=2000&q=80",
  bannerImageAlt: "Industrial process piping and plant equipment",
  logoImage: "",
  logoImageAlt: "Crescent International",
  wheelTitle: "Stock we are quoting this week",
  wheelCtaLabel: "Open full catalogue",
  wheelCtaHref: "/all-products",
  wheelProductsPerCategory: 2,
};

const contact: ContactContent = {
  title: "Contact sales",
  intro:
    "Call or write with the model, capacity, and site voltage. We quote from Tejgaon stock or indent from the factory with a delivery window.",
  phoneLabel: "Phone",
  phoneValue: SALES_PHONE,
  emailLabel: "Email",
  emailValue: SALES_EMAIL,
  purchaseSectionTitle: "Enquire on a machine",
  whatsappButtonLabel: "WhatsApp",
  emailButtonLabel: "Email",
  phoneButtonLabel: "Phone",
  tempButtonLabel: "Works",
  whatsappPopupTitle: "WhatsApp",
  emailPopupTitle: "Email",
  phonePopupTitle: "Phone",
  defaultWhatsappHref: "https://wa.me/8801713445566",
  defaultTempHref: "tel:+880288761122",
  whatsappOptions: [
    { label: "Sales WhatsApp", value: SALES_WHATSAPP },
    { label: "Indent desk", value: "+880 1819-220011" },
  ],
  phoneOptions: [
    { label: "Sales mobile", value: SALES_PHONE },
    { label: "Tejgaon office", value: OFFICE_PHONE },
  ],
  emailOptions: [
    { label: "Sales", value: SALES_EMAIL },
    { label: "Accounts / info", value: INFO_EMAIL },
  ],
};

const footer: FooterContent = {
  brandName: "Crescent International",
  description:
    "Industrial machinery trader in Tejgaon. We supply, install, and support production equipment for factories in Dhaka, Chattogram, and Gazipur.",
  homeButtonLabel: "Home",
  homeButtonHref: "/",
  categoriesButtonLabel: "Categories",
  categoriesButtonHref: "/#category-hydraulic",
  contactButtonLabel: "Contact",
  contactButtonHref: "/contact-us",
  aboutButtonLabel: "About",
  aboutButtonHref: "/about-us",
  findUsLabel: "Yard and office",
  mapPlaceLabel: "Tejgaon Industrial Area on Maps",
  mapUrl: "https://maps.google.com/?q=23.7639,90.3925",
  phoneLabel: "Phone",
  phones: [SALES_PHONE, OFFICE_PHONE],
  emailLabel: "Email",
  emails: [SALES_EMAIL, INFO_EMAIL],
  addressLabel: "Address",
  addressValue: ADDRESS,
  footerNote: "Crescent International · Tejgaon, Dhaka · Trade licence 2018-2026",
};

const aboutTitle = "About Crescent International";
const aboutBody = `Crescent International is a Dhaka-based machinery house. We buy, stock, and indent industrial equipment for garment washing, food plants, ready-mix, and general fabrication shops.

The Tejgaon yard holds hydraulic power packs, mixers, crushers, and packaging machines that we can demonstrate before dispatch. Larger crushers, kettles, and cranes are indent orders with factory lead times we put in writing on the quotation.

Sales, service, and spare parts sit in the same office so a breakdown call goes to the people who sold the machine.`;

const termsTitle = "Sale terms";
const termsBody = `Quotations are valid for 15 days unless the sheet says otherwise. Prices are ex-Tejgaon unless freight is listed as a line item. VAT and customs on indent machines are extra and billed at actuals.

A 40% advance confirms the order. Balance is due before the machine leaves the yard or, for indent, against shipping documents.

Warranty covers manufacturing defects for 12 months from commissioning or 18 months from invoice, whichever comes first. Wear parts, electrics damaged by poor supply, and operator error are excluded. Commissioning is included for Dhaka and Gazipur; other districts are quoted as travel.

Returns are not accepted on electrical or custom-built items after dispatch. Disputes follow the courts of Dhaka.`;

export const seedCategories: CategoryInsert[] = [
  {
    slug: "hydraulic",
    name: "Hydraulic",
    description:
      "Power packs, cylinders, and valve banks for presses, dumpers, and plant that already runs on 415 V three-phase.",
    sortOrder: 1,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
  {
    slug: "mixer",
    name: "Mixers",
    description: "Planetary, twin-shaft, and ribbon mixers for concrete, dry mortar, paint, and powder blending.",
    sortOrder: 2,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
  {
    slug: "aggregate",
    name: "Aggregate",
    description: "Jaw and cone crushers, screens, and feeders for stone and recycled concrete plants.",
    sortOrder: 3,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
  {
    slug: "food",
    name: "Food process",
    description: "Stainless kettles, washers, fillers, and conveyors built for wet rooms and daily CIP.",
    sortOrder: 4,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
  {
    slug: "handling",
    name: "Material handling",
    description: "Forklifts, stackers, pallet trucks, and workshop cranes for warehouses in Dhaka and Chattogram.",
    sortOrder: 5,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
  {
    slug: "packaging",
    name: "Packaging",
    description: "Stretch wrappers, carton sealers, baggers, and label applicators for finished-goods lines.",
    sortOrder: 6,
    homepageDesktopCount: 4,
    homepageMobileCount: 4,
  },
];

function stock(...ids: string[]) {
  return ids.map(
    (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`,
  );
}

function item(
  slug: string,
  name: string,
  categorySlug: string,
  category: string,
  priceRange: string,
  shortDescription: string,
  description: string,
  seoHashtags: string[],
  images: string[],
): ProductInsert {
  return {
    slug,
    name,
    category,
    categorySlug,
    priceRange,
    shortDescription,
    images,
    contactWhatsapp: SALES_WHATSAPP,
    contactEmail: SALES_EMAIL,
    contactPhone: SALES_PHONE,
    contactTemp: OFFICE_PHONE,
    seoHashtags,
    description,
  };
}

export const seedProducts: ProductInsert[] = [
  item(
    "ci-hp-30",
    "CI-HP-30 hydraulic power pack",
    "hydraulic",
    "Hydraulic",
    "BDT 185,000 – 265,000",
    "30 L/min pack with 15 kW motor, 210 bar relief, 200 L tank. Used on small presses and scissor lifts.",
    "The CI-HP-30 is a skid-mounted power pack: 15 kW 415 V motor, 30 L/min gear pump, 210 bar relief, return filter, and a 200 litre reservoir with level and temperature switches. We wire it for DOL or star-delta as the site board allows. Typical jobs are 40–80 tonne workshop presses and dock levellers. Oil and hoses are extra; commissioning in Dhaka is included.",
    ["hydraulic-power-pack", "210-bar", "tejgaon"],
    stock("photo-1513828583688-c52646db42da", "photo-1581092160562-40aa08e78837"),
  ),
  item(
    "ci-cy-80",
    "CI-CY-80 double-acting cylinder",
    "hydraulic",
    "Hydraulic",
    "BDT 95,000 – 140,000",
    "80 tonne, 500 mm stroke, 70 mm rod, SAE ports. Built for scrap balers and mould presses.",
    "Double-acting mill-type cylinder rated 80 tonne at 210 bar, 500 mm stroke, 70 mm induction-hardened rod, honed tube, and SAE 6000 ports. Cushions at both ends. We supply pins and clevises to the drawing you send. Seal kits are stocked in Tejgaon.",
    ["hydraulic-cylinder", "80-tonne"],
    stock("photo-1581092918056-0c4c3acd3789", "photo-1565043666747-69f6646db940"),
  ),
  item(
    "ci-dv-12",
    "CI-DV-12 directional valve bank",
    "hydraulic",
    "Hydraulic",
    "BDT 48,000 – 72,000",
    "Three-spool 12 GPM bank, 315 bar, parallel circuit, 24 V DC solenoids.",
    "Sectional directional valve, three spools, 45 L/min, 315 bar, parallel circuit, with 24 V DC wet-pin solenoids and a main relief. Work-port reliefs optional. Used on small dumpers and hydraulic tables. We match coil voltage to your PLC or pendant.",
    ["directional-valve", "solenoid"],
    stock("photo-1581092162384-8987c1d64718", "photo-1513828583688-c52646db42da"),
  ),
  item(
    "ci-hp-55",
    "CI-HP-55 high-pressure power unit",
    "hydraulic",
    "Hydraulic",
    "BDT 410,000 – 560,000",
    "55 L/min, 280 bar piston pump, 37 kW, 400 L tank, water-cooled option.",
    "High-pressure unit for larger presses: 37 kW motor, variable piston pump 55 L/min, 280 bar, 400 litre tank, pressure filter, and optional plate cooler for 35 °C ambient. Soft-start panel is quoted with the pack. Lead time from yard if the cooler is in stock; otherwise four to six weeks indent.",
    ["piston-pump", "280-bar"],
    stock("photo-1504328345606-18bbc8c9d7d1", "photo-1565043666747-69f6646db940"),
  ),
  item(
    "ci-mx-500",
    "CI-MX-500 planetary concrete mixer",
    "mixer",
    "Mixers",
    "BDT 620,000 – 780,000",
    "500 litre pan, 18.5 kW, skip hoist optional. For precast yards in Gazipur.",
    "Planetary pan mixer, 500 litre compacted output, 18.5 kW main drive, Ni-hard tiles, and hydraulic discharge door. Skip hoist and weigh batching are optional. Cycle time is about 60 seconds on 25 MPa mix. We install on a steel frame or on your existing tower.",
    ["planetary-mixer", "precast"],
    stock("photo-1590496793929-36417d3117de", "photo-1504307651254-35680f356dfd"),
  ),
  item(
    "ci-mx-2000",
    "CI-MX-2000 twin-shaft mixer",
    "mixer",
    "Mixers",
    "BDT 2,400,000 – 3,100,000",
    "2.0 m³ compacted, 2 × 37 kW, for ready-mix plants at 60–90 m³/h.",
    "Twin-shaft mixer, 2.0 m³ compacted batch, two 37 kW gearmotors, hydraulic discharge, and automatic lubrication. Suited to a 60–90 m³/h wet-mix plant. Wear arms and tiles are local stock. Foundation bolts and a commissioning engineer for three days are in the price for Dhaka Division.",
    ["twin-shaft", "ready-mix"],
    stock("photo-1541888946425-d81bb19240f5", "photo-1590496793929-36417d3117de"),
  ),
  item(
    "ci-rm-12",
    "CI-RM-12 ribbon blender",
    "mixer",
    "Mixers",
    "BDT 340,000 – 455,000",
    "1,200 litre U-trough, 11 kW, food or dry-mortar liner to order.",
    "Ribbon blender, 1,200 litre working volume, 11 kW, outboard bearings, and a pneumatically actuated discharge. Inner and outer ribbons for dry mortar, spices, or plastic masterbatch. Stainless 304 contact parts for food; mild steel with epoxy for mortar. Dust lid and bag dump optional.",
    ["ribbon-blender", "dry-mix"],
    stock("photo-1615485290382-441e4d049cb5", "photo-1516594798947-e65505dbb29d"),
  ),
  item(
    "ci-pm-80",
    "CI-PM-80 high-speed disperser",
    "mixer",
    "Mixers",
    "BDT 275,000 – 360,000",
    "80 kW inverter, 1,400 mm lift, for paint and adhesive batches up to 2,000 L.",
    "Floor-standing disperser with 80 kW inverter, hydraulic lift 1,400 mm, and a 400 mm Cowles blade. Used on alkyd paint and PVA adhesive. Vessel clamp and explosion-proof motor are quoted separately for solvent rooms.",
    ["disperser", "paint"],
    stock("photo-1635405074683-96d6921a2a68", "photo-1581092160562-40aa08e78837"),
  ),
  item(
    "ci-jc-400",
    "CI-JC-400 jaw crusher",
    "aggregate",
    "Aggregate",
    "BDT 1,850,000 – 2,200,000",
    "400 × 250 mm feed, 30 kW, 15–40 t/h on granite, toggle protected.",
    "Single-toggle jaw, 400 × 250 mm, 30 kW, CSS 20–60 mm. Throughput 15–40 t/h depending on stone and CSS. Pitman and flywheel are balanced for a 1,500 rpm motor. We supply the v-belt drive, motor rail, and a set of jaw plates. Foundation drawing comes with the order.",
    ["jaw-crusher", "granite"],
    stock("photo-1504307651254-35680f356dfd", "photo-1541888946425-d81bb19240f5"),
  ),
  item(
    "ci-cs-900",
    "CI-CS-900 cone crusher",
    "aggregate",
    "Aggregate",
    "BDT 4,800,000 – 6,200,000",
    "900 mm head, 90 kW, hydraulic CSS, for secondary granite and basalt.",
    "Symons-type cone, 900 mm, 90 kW, hydraulic CSS adjustment and tramp release. Typical secondary duty 50–80 t/h. Bowl liner and mantle are high-chrome. Lube skid and hydraulic power pack ship with the crusher. Indent only; allow eight to ten weeks plus customs.",
    ["cone-crusher", "secondary"],
    stock("photo-1541888946425-d81bb19240f5", "photo-1601584115197-04ecc0da31d7"),
  ),
  item(
    "ci-vs-1200",
    "CI-VS-1200 three-deck screen",
    "aggregate",
    "Aggregate",
    "BDT 980,000 – 1,250,000",
    "1,200 × 3,000 mm, 15 kW, 3 decks, circular throw, for 0–40 mm products.",
    "Inclined circular-throw screen, 1,200 × 3,000 mm, three decks, 15 kW, coil springs. Mesh is quoted to your cut sizes (commonly 40 / 20 / 10 mm). Spray bars for wet screening are optional. We align it on the structure you already have or supply a new chassis.",
    ["vibrating-screen", "aggregate"],
    stock("photo-1590496793929-36417d3117de", "photo-1601584115197-04ecc0da31d7"),
  ),
  item(
    "ci-bf-20",
    "CI-BF-20 belt feeder",
    "aggregate",
    "Aggregate",
    "BDT 420,000 – 560,000",
    "800 mm belt, 20 m centres, 7.5 kW, variable speed for crusher feed.",
    "Belt feeder, 800 mm EP belt, 20 m centres, 7.5 kW SEW or equivalent gearbox, inverter ready. Skirt boards, pull-cord, and belt drift switches included. Used under a hopper ahead of the CI-JC-400. Idlers and pulley lagging are local replacements.",
    ["belt-feeder", "crusher-feed"],
    stock("photo-1601584115197-04ecc0da31d7", "photo-1504307651254-35680f356dfd"),
  ),
  item(
    "ci-fp-300",
    "CI-FP-300 jacketed kettle",
    "food",
    "Food process",
    "BDT 510,000 – 680,000",
    "300 litre SS304 kettle, steam jacket 3 bar, scrape agitator, for sauces and halwa.",
    "Jacketed kettle, 300 litre, SS304 product contact, 3 bar steam jacket, scrape-surface agitator 1.5 kW, and a bottom ball valve. Lid with charging port. Built for wet rooms; IP55 motors. We hydro-test the jacket before dispatch. Steam trap set is extra.",
    ["jacketed-kettle", "ss304"],
    stock("photo-1556910103-1c02745aae4d", "photo-1600565193348-f74bd3c7ccdf"),
  ),
  item(
    "ci-vw-800",
    "CI-VW-800 vegetable washer",
    "food",
    "Food process",
    "BDT 390,000 – 510,000",
    "800 mm bubble washer, 3 t/h on leafy greens, SS304, recirculation tank.",
    "Air-bubble washer, 800 mm width, about 3 t/h on spinach and coriander, SS304 tank, recirculation pump, and a fresh-water rinse section. Used by frozen-food and catering kitchens in Dhaka. Ozone or chlorine dosing skid quoted on request.",
    ["vegetable-washer", "bubble"],
    stock("photo-1464226184884-fa280b87c399", "photo-1625246333195-78d9c38ad449"),
  ),
  item(
    "ci-ff-150",
    "CI-FF-150 piston filler",
    "food",
    "Food process",
    "BDT 265,000 – 340,000",
    "Two-head piston filler, 50–500 ml, for paste, ghee, and yoghurt cups.",
    "Semi-automatic two-head piston filler, 50–500 ml cylinders, SS316 contact, foot-switch or photo-eye. Change parts for cups and jars. Hopper 40 litre with optional agitator for viscous masala paste. Output depends on operator; typically 12–18 cups/min.",
    ["piston-filler", "dairy"],
    stock("photo-1556911220-bff31c812dba", "photo-1556912173-46c336c7fd55"),
  ),
  item(
    "ci-sc-40",
    "CI-SC-40 food-grade screw conveyor",
    "food",
    "Food process",
    "BDT 180,000 – 245,000",
    "Ø 200 mm, 4 m, SS304 tube, 2.2 kW, for spice and flour transfer.",
    "Tubular screw, 200 mm, 4 m centres, SS304, 2.2 kW, inlet hopper and outlet spout. Flighting is continuous. Used between a ribbon blender and a packing hopper. Longer runs are made in sections. Inlet grate and magnet are optional.",
    ["screw-conveyor", "ss304"],
    stock("photo-1615485290382-441e4d049cb5", "photo-1516594798947-e65505dbb29d"),
  ),
  item(
    "ci-fl-3",
    "CI-FL-3 electric forklift 3 t",
    "handling",
    "Material handling",
    "BDT 1,150,000 – 1,450,000",
    "3 tonne, 4.5 m mast, 48 V, cushion tyres, for indoor RMG warehouses.",
    "Four-wheel electric forklift, 3,000 kg at 500 mm, 4.5 m duplex mast, 48 V lead-acid, side shift, and cushion tyres. Charger included. We register it and train two operators in Dhaka. Lithium pack is a priced option. Service is from Tejgaon.",
    ["forklift", "3-tonne", "electric"],
    stock("photo-1553413077-190dd305871c", "photo-1565793298595-6a879b1d9492"),
  ),
  item(
    "ci-hc-2",
    "CI-HC-2 hand pallet truck",
    "handling",
    "Material handling",
    "BDT 18,500 – 24,000",
    "2,000 kg, 1,150 mm forks, nylon wheels, for 1,200 × 1,000 pallets.",
    "Manual pallet truck, 2,000 kg, 1,150 × 160 mm forks, nylon steer and load wheels. Entry rollers for closed pallets. We keep seals and pumps on the shelf. Not for block pallets unless you order the 800 mm fork set.",
    ["pallet-truck", "2-tonne"],
    stock("photo-1587293852726-70cdb56c2866", "photo-1586528116311-ad8dd3c8310d"),
  ),
  item(
    "ci-st-12",
    "CI-ST-12 walkie stacker",
    "handling",
    "Material handling",
    "BDT 285,000 – 365,000",
    "1.2 tonne, 3.3 m lift, 24 V, for mezzanine feeding in garment stores.",
    "Pedestrian stacker, 1,200 kg, 3.3 m triplex mast, 24 V, straddle or fork-over to match your pallets. Battery and charger included. Aisle width about 2.2 m with 1,200 mm pallets. We set the tilt and train the store team.",
    ["stacker", "walkie"],
    stock("photo-1565793298595-6a879b1d9492", "photo-1553413077-190dd305871c"),
  ),
  item(
    "ci-cr-5",
    "CI-CR-5 workshop crane 5 t",
    "handling",
    "Material handling",
    "BDT 890,000 – 1,180,000",
    "5 tonne single girder, 12 m span, 6 m lift, pendant, for fabrication bays.",
    "Single-girder EOT, 5 tonne, 12 m span, 6 m lift, dual-speed hoist, pendant control. End carriages and festoon included. Building steel must take the loads; we supply reactions with the drawing. Installation is quoted after a site visit. Load test is done before handover.",
    ["eot-crane", "5-tonne"],
    stock("photo-1581092918056-0c4c3acd3789", "photo-1565043666747-69f6646db940"),
  ),
  item(
    "ci-sw-200",
    "CI-SW-200 stretch wrapper",
    "packaging",
    "Packaging",
    "BDT 195,000 – 260,000",
    "Turntable 1,650 mm, 1.5 t, 2.4 m mast, for pallet loads leaving the plant.",
    "Turntable stretch wrapper, 1,650 mm disc, 1,500 kg, 2.4 m film mast, 15 rpm. Pre-stretch 200% carriage. Used on export cartons and sack pallets. Film is not included. We set wrap counts to your load test.",
    ["stretch-wrapper", "pallet"],
    stock("photo-1586528116311-ad8dd3c8310d", "photo-1578575437130-527eed3abbec"),
  ),
  item(
    "ci-cs-50",
    "CI-CS-50 carton sealer",
    "packaging",
    "Packaging",
    "BDT 125,000 – 165,000",
    "Top and bottom tape, 50 cartons/min, for 200–500 mm box heights.",
    "Uniform carton sealer, top and bottom 2 inch tape, up to about 50 cartons per minute on a straight line. Box height 200–500 mm with crank adjust. Infeed and outfeed tables extra. Tape heads take local BOPP.",
    ["carton-sealer", "tape"],
    stock("photo-1578575437130-527eed3abbec", "photo-1610557892470-55d9e80c0bce"),
  ),
  item(
    "ci-lb-10",
    "CI-LB-10 label applicator",
    "packaging",
    "Packaging",
    "BDT 210,000 – 285,000",
    "Wipe-on applicator, 10–30 m/min, for bottles and cartons on an existing belt.",
    "Wipe-on label applicator for pressure-sensitive labels, 10–30 m/min, photoelectric start. Mounts on your conveyor. Max label width 120 mm. Printer is not included; we integrate a third-party coder if you already own one.",
    ["label-applicator", "ps-label"],
    stock("photo-1615485290382-441e4d049cb5", "photo-1610557892470-55d9e80c0bce"),
  ),
  item(
    "ci-bg-25",
    "CI-BG-25 open-mouth bagger",
    "packaging",
    "Packaging",
    "BDT 480,000 – 640,000",
    "25 kg net weigher, gravity feed, for rice, sugar, and plastic pellets.",
    "Open-mouth bagger with 25 kg net weigher, gravity feeder, and a sewing pedestal. Accuracy typically ±20 g on free-flowing rice. Dust hood and bag magazine optional. Throughput 6–8 bags/min with two operators. Load cells are sealed for a dusty mill.",
    ["bagger", "25kg"],
    stock("photo-1625246333195-78d9c38ad449", "photo-1615811361523-6bd03d7748e7"),
  ),
];

export const seedSettings: SettingInsert[] = [
  { id: "home", data: home, body: "" },
  { id: "contact", data: contact, body: "" },
  { id: "footer", data: footer, body: "" },
  { id: "about", data: { title: aboutTitle }, body: aboutBody },
  { id: "terms", data: { title: termsTitle }, body: termsBody },
];
