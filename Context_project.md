Hi, how are you? Okay, here is the situation I have a friend who has been given a proposal from his employer about Research_Proposal_Presentation - Predicting Dublin Property Prices Using Alternative Data through AI Now he has given me a task to build a website template which shows properties of Dublin and a map on which we can show their prices, address, link to the property detail page He says that whichever property is closer or nearer to the park, cycling track, walking track, and bus station, with a low crime rate, its prices will be higher He has the data set for those properties, which includes parks, cycle track, walking track, bus station, and crime rate, so whenever we open any address, we have to show these things on the map of that particular address property, he says that its GIS (A Geographic Information System (GIS) is a computer framework used to capture, store, analyze, and visualize spatial data tied to specific locations. It enables mapping relationships, patterns, and trends by layering diverse data types—such as roads, buildings, and environmental features—to support decision-making) We have to show all kinds of information about the properties, which makes prices better on the approval map; that's the whole idea He has shared an example site template: https://www.sherryfitz.ie/buy/house/dublin We have already created this static site template in react.js according to example site which shows dummy properties at left and map iframe at right now we have to make it real, example site uses mapbox for map to show properties info on it, I want you to analyze the example site template in-depth and explain me how can i create this website with all the required functionality my friend need in real dynamic site, for now we will use dummy Dublin data After explaining to me then guide AI agent step-by-step process how to make a static template a dynamic website with dummy Dublin data and map functionality to display all info regarding properties do the web search for example site and GIS



I checked the public Dublin search page and the property detail pages on Sherry FitzGerald. The search page is laid out like a classic property portal: search-type tabs, location search, price ranges, property type, energy rating, bedrooms, bathrooms, size, features, search controls, a map toggle, and sorting above the results area. The parsed public HTML does not expose the exact map library, so I can describe the behavior and layout, but I cannot confirm the internal implementation from the page text alone.

The property detail pages show the pattern you should copy: hero/gallery area, share/print/contact blocks, asking price, beds, baths, area, a description section, features, and room-by-room breakdown. The descriptions also mention nearby transport and parks, which fits your “amenity proximity affects value” idea very well.

GIS is the right concept here because it connects location data with descriptive data so you can map, analyze, and compare spatial relationships and patterns. That is exactly what you need for properties, parks, cycle tracks, walking tracks, bus stations, and crime data.

Mapbox GL JS supports markers and popups, and Mapbox’s React tutorial specifically covers dynamic markers and popups for custom data. For backend spatial work, PostGIS extends PostgreSQL for geospatial data and is designed for efficient radius queries such as “what is near this property?” using ST_DWithin and spatial indexes.

Here is the clean way to build your dynamic version.

Keep the same page structure as the example site
Use a left results panel and a right map panel on the listing page. Put filters at the top or in a collapsible sidebar. Each property card should show price, address, beds, baths, size, and a short “nearby amenities” summary. The map should stay synced with the list.
Create a dummy Dublin data model first
Use one JSON array for properties and separate arrays for amenities. Each property should have: id, slug, title, price, address, lat, lng, beds, baths, sqm, crimeScore, nearestPark, nearestCycleTrack, nearestWalkingTrack, nearestBusStation, images, description, and features.
Use map markers for properties and layers for amenities
On the map, show one marker per property. Show parks, cycle tracks, walking tracks, and bus stations as separate visible layers or icon sets. When a user clicks a property marker, open a popup with price and key stats, and highlight the matching card in the left panel.
Make the detail page data-driven
The property detail page should reuse the same dummy dataset. Route it by slug, for example /buy/house/dublin/[slug]. On that page, show: gallery, price, address, score card, proximity badges, map centered on that property, and a “nearby places” block that lists the park, bus station, cycle track, walking track, and crime score.
Add a scoring layer for the research idea
Do not treat price as only a raw number. Add a separate “location desirability score” based on shorter distance to park/cycle/walk/bus and lower crime rate. For dummy data, this can be a simple weighted score. Later, it can be replaced by a real AI/ML model.
Make filtering and sorting match the score logic
Filters should allow price range, beds, baths, crime band, and amenity proximity. Sorting should allow price low/high, newest, and “highest desirability score.” That makes the page useful both as a property listing site and as a research demo.
Only after the UI works, connect the real data pipeline
When the dummy version is stable, replace JSON with an API. For real geospatial queries, store coordinates in PostgreSQL/PostGIS, run distance searches, and return the nearest amenities for each property.

A practical dummy-data schema would look like this:

{
  id: 1,
  slug: "dublin-16-rathfarnham-example-1",
  title: "3 Bed House in Rathfarnham",
  price: 545000,
  address: "Rathfarnham, Dublin 16",
  lat: 53.289,
  lng: -6.288,
  beds: 3,
  baths: 3,
  sqm: 119,
  crimeScore: 18,
  nearestAmenities: {
    park: { name: "Marlay Park", distanceM: 750 },
    cycleTrack: { name: "Dodder Greenway", distanceM: 420 },
    walkingTrack: { name: "Local Walking Trail", distanceM: 210 },
    busStation: { name: "Bus Stop 1234", distanceM: 160 }
  },
  features: ["EV Charger", "Garden", "Parking"],
  description: "..."
}

For the AI agent, give it this build order:

Start with the data shape and dummy Dublin records. Then build the listing page grid and map split layout. Next, wire markers, popups, card hover sync, and click-to-center behavior. After that, build the detail route and render the same property record there. Finally, add filters, sorting, and the desirability score, then swap dummy data for API data.

The key design decision is this: treat the map not as decoration, but as the main analysis surface. The list tells the story, but the map proves the story. That is the heart of this GIS-style property research site.