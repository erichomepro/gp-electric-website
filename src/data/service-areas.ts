export interface ServiceArea {
  name: string;
  slug: string;
  population: string;
  distance: string;
  description: string;
  uniqueAngle: string;
  electricalNeeds: string[];
  localContext: string;
}

export const serviceAreas: ServiceArea[] = [
  {
    name: "Grande Prairie",
    slug: "grande-prairie",
    population: "71,000+",
    distance: "Home base",
    description: "As Grande Prairie's local electrician, GP Electric is proud to serve the fastest-growing city in northwestern Alberta. With over 700 new homes being built in 2025 alone, the demand for quality electrical work has never been higher.",
    uniqueAngle: "Primary service hub — fastest response times, largest crew availability",
    electricalNeeds: [
      "New home construction electrical (700+ starts in 2025)",
      "Panel upgrades for older homes (1970s-2000s stock)",
      "EV charger installations for the growing EV community",
      "Commercial electrical for the region's retail hub",
      "Emergency electrical service — 24/7 availability",
      "Renovation and basement development electrical"
    ],
    localContext: "Grande Prairie is the economic hub of the Peace Country, serving over 300,000 people in northwestern Alberta. With a population over 71,000 and an average age of just 35, this is a city of young families building their futures — and they need reliable electrical services to match."
  },
  {
    name: "Clairmont",
    slug: "clairmont",
    population: "5,100+",
    distance: "10 minutes from GP",
    description: "Clairmont is one of the fastest-growing communities in the County of Grande Prairie, with new residential developments and acreages expanding every year. GP Electric provides full electrical services to Clairmont homes, shops, and businesses.",
    uniqueAngle: "Rapidly growing bedroom community with new builds and acreage development",
    electricalNeeds: [
      "New home and acreage electrical",
      "Shop and garage wiring for rural properties",
      "Panel upgrades for growing electrical demands",
      "Yard lighting and outdoor electrical",
      "Underground service runs to outbuildings",
      "Hot tub and pool wiring"
    ],
    localContext: "Clairmont is the administrative seat of the County of Grande Prairie, just 10 minutes north of the city. It's a popular choice for families wanting larger lots and rural living with easy access to city amenities. New subdivisions and acreage developments keep construction — and electrical demand — steady."
  },
  {
    name: "Sexsmith",
    slug: "sexsmith",
    population: "2,400+",
    distance: "15 minutes from GP",
    description: "Known as the 'Grain Elevator Capital of Alberta,' Sexsmith is a charming small town with deep agricultural roots. GP Electric serves Sexsmith residents and farmers with reliable residential and farm electrical services.",
    uniqueAngle: "Agricultural heritage community — farm and residential electrical focus",
    electricalNeeds: [
      "Farm and acreage electrical service",
      "Grain bin and dryer circuits",
      "Shop wiring for farm operations",
      "Residential panel upgrades",
      "Yard and security lighting",
      "Generator installation for rural power reliability"
    ],
    localContext: "Sexsmith sits just 15 minutes north of Grande Prairie on Highway 2. This agricultural community is home to historic grain elevators and surrounded by active farmland. Residents and farmers here need an electrician who understands rural electrical — that's GP Electric."
  },
  {
    name: "Beaverlodge",
    slug: "beaverlodge",
    population: "2,300+",
    distance: "40 minutes from GP",
    description: "Beaverlodge is a thriving agricultural town west of Grande Prairie on Highway 43. GP Electric provides residential, farm, and commercial electrical services to the Beaverlodge community and surrounding agricultural area.",
    uniqueAngle: "Agricultural hub — large farm operations, grain storage, and equipment electrical",
    electricalNeeds: [
      "Farm electrical — barns, shops, grain bins",
      "Large shop wiring for agricultural equipment",
      "Residential electrical and renovations",
      "Commercial electrical for local businesses",
      "Underground service for farm outbuildings",
      "Solar panel installation (farm tax credits available)"
    ],
    localContext: "Beaverlodge is a key agricultural center in the Peace Country, known for its canola, grain, and cattle operations. With farms running increasingly sophisticated equipment, the electrical demands on rural properties keep growing. GP Electric serves Beaverlodge and the surrounding farmland."
  },
  {
    name: "Wembley",
    slug: "wembley",
    population: "1,400+",
    distance: "15 minutes from GP",
    description: "Wembley is a growing community just west of Grande Prairie with a mix of residential properties and rural acreages. GP Electric provides complete electrical services to Wembley residents and acreage owners.",
    uniqueAngle: "Growing residential community with acreage development",
    electricalNeeds: [
      "Acreage and rural residential electrical",
      "Shop and garage wiring",
      "Residential renovations and upgrades",
      "Lighting installations",
      "Panel upgrades",
      "Generator installation"
    ],
    localContext: "Wembley offers residents a small-town feel with quick access to Grande Prairie. Many properties are acreages with shops and outbuildings that need reliable electrical service. GP Electric is just 15 minutes away."
  },
  {
    name: "Hythe",
    slug: "hythe",
    population: "800+",
    distance: "55 minutes from GP",
    description: "Hythe is a small village west of Grande Prairie serving the surrounding agricultural community. GP Electric provides reliable electrical service to Hythe and the surrounding rural area.",
    uniqueAngle: "Remote agricultural community — reliability and emergency response matter most",
    electricalNeeds: [
      "Farm and acreage electrical",
      "Emergency electrical response",
      "Generator installation for power reliability",
      "Shop wiring",
      "Residential electrical service",
      "Well pump and water system wiring"
    ],
    localContext: "Hythe is a small but resilient community about 55 minutes west of Grande Prairie. With fewer local service options, Hythe residents rely on Grande Prairie-based trades. GP Electric serves the Hythe area with the same quality and responsiveness as our in-city customers."
  },
  {
    name: "Spirit River",
    slug: "spirit-river",
    population: "850+",
    distance: "75 minutes from GP",
    description: "Spirit River is a northern community in the Peace Country known for its agricultural roots and cold winters. GP Electric serves Spirit River with residential, farm, and emergency electrical services.",
    uniqueAngle: "Northern community — winter preparedness and backup power are essential",
    electricalNeeds: [
      "Generator installation for extreme cold backup",
      "Farm electrical service",
      "Residential heating circuit service",
      "Emergency electrical response",
      "Shop and barn wiring",
      "Heat trace and freeze protection systems"
    ],
    localContext: "Spirit River sits northwest of Grande Prairie in the heart of Peace Country agriculture. Winters here are harsh, and reliable electrical — especially backup generators and heating systems — isn't a luxury, it's a necessity. GP Electric serves Spirit River and the surrounding area."
  },
  {
    name: "Valleyview",
    slug: "valleyview",
    population: "1,300+",
    distance: "115 minutes from GP",
    description: "Valleyview is the 'Gateway to the Peace,' sitting at the junction of Highways 43 and 49. GP Electric serves the Valleyview community with residential and commercial electrical services.",
    uniqueAngle: "Highway corridor community — mix of commercial and residential needs",
    electricalNeeds: [
      "Commercial electrical for highway businesses",
      "Residential electrical service",
      "Panel upgrades and renovations",
      "Industrial and oilfield electrical",
      "Generator installation",
      "Lighting for commercial properties"
    ],
    localContext: "Valleyview is a strategic community at the crossroads of major highways, with a mix of commercial businesses serving travelers and a residential base of families and workers in the oil and gas sector. Electrical needs here span from homes to highway businesses to industrial sites."
  },
  {
    name: "Fairview",
    slug: "fairview",
    population: "2,400+",
    distance: "130 minutes from GP",
    description: "Fairview is a vibrant Peace Country town home to GPRC's Fairview Campus. GP Electric serves Fairview with residential, commercial, and farm electrical services.",
    uniqueAngle: "College town — mix of rental properties, commercial, and agricultural electrical",
    electricalNeeds: [
      "Rental property electrical maintenance",
      "Commercial electrical for local businesses",
      "Farm and acreage electrical",
      "Residential renovations and upgrades",
      "Institutional electrical",
      "Panel upgrades for older properties"
    ],
    localContext: "Fairview is a key community in the Peace Country, known for its college campus, agricultural heritage, and tight-knit community. The mix of rental properties, family homes, farms, and local businesses creates consistent demand for quality electrical services."
  },
  {
    name: "Peace River",
    slug: "peace-river",
    population: "6,600+",
    distance: "120 minutes from GP",
    description: "Peace River is the second-largest community in the Peace Country region and a northern hub for oil and gas, agriculture, and government services. GP Electric serves Peace River with full electrical capabilities.",
    uniqueAngle: "Northern regional hub — diverse electrical needs from residential to industrial",
    electricalNeeds: [
      "Residential electrical service",
      "Commercial and institutional electrical",
      "Industrial and oilfield electrical",
      "Panel upgrades and renovations",
      "Farm and acreage electrical",
      "Emergency electrical service"
    ],
    localContext: "Peace River is a regional centre with a diverse economy spanning oil and gas, agriculture, forestry, and government services. With a population of over 6,600, it's the second-largest community in the Peace Country and has electrical needs ranging from residential homes to industrial facilities."
  }
];
