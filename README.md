# Pokédex Challenge

Pokédex web application built as a technical challenge using React and the PokéAPI.

The application allows users to browse Pokémon, search and filter them, view detailed information, manage a team of favorites, and compare two Pokémon.

## Tech Stack

- React
- Vite
- Redux Toolkit
- RTK Query
- Redux Persist
- React Router
- Formik
- Yup
- CSS Modules
- PokéAPI

## Features

- Infinite scroll Pokémon list
- Progressive image loading
- Pokémon details including sprites, types, abilities, stats, height and weight
- Real-time search with 300ms debounce
- Filtering by type and generation
- Search and filter persistence through URL query parameters
- Favorites management with a maximum of 6 Pokémon
- Favorites persistence using Redux Persist
- Pokémon comparison with Formik and Yup validation
- RTK Query caching and tag configuration
- Online/offline connection status
- Automatic refetch when the connection is restored
- Loading skeletons
- Empty states
- Network error handling with retry
- Responsive layout

## Installation

Clone the repository:

```bash
git clone https://github.com/gpcoding15/dcac-pokedex-challenge
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open the local URL provided by Vite.

## Architecture

The application is organized into pages, reusable components, custom hooks, Redux features and API services.

API communication is centralized in an RTK Query service. This provides query caching, request state management and automatic refetch behavior.

Favorites are managed separately through a Redux slice. Only Pokémon IDs are stored in the favorites state, while Pokémon details are retrieved through RTK Query.

## Cache and Persistence

RTK Query is used for API request caching during the application session.

Redux Persist is used to persist the favorites state in localStorage, allowing the user's selected Pokémon to survive page refreshes.

During development, persisting the complete RTK Query cache was evaluated. Because Pokémon cards request detailed data individually and infinite scrolling can produce a large number of cached responses, persisting the complete API state could exceed the browser's localStorage quota.

For that reason, API cache persistence was intentionally limited in the current implementation while favorites remain persisted. A production implementation could use a bounded persistence strategy or a storage mechanism better suited for larger cached datasets.

## Technical Decisions

### RTK Query

RTK Query centralizes communication with PokéAPI and avoids manually managing loading and request states.

Cache tags are configured for Pokémon, types and generations. The API is currently read-only, so there are no mutations requiring automatic tag invalidation.

refetchOnReconnect is enabled together with RTK Query listeners so active queries can refresh when the browser regains connectivity.

### Favorites

Favorites are stored as Pokémon IDs instead of duplicating complete Pokémon objects. This keeps the Redux state small and allows Pokémon data to continue coming from the API layer.

The team is limited to six Pokémon.

### Search and Filters

Search uses a custom debounce hook with a 300ms delay.

Type, generation and search values are synchronized with URL query parameters so the current search state can be preserved and shared.

## Future Improvements

- Persist a bounded subset of the RTK Query cache for stronger offline support
- Add automated tests
- Add drag and drop ordering to the favorites team
- Add a chart to the Pokémon comparison
- Improve accessibility
- Add additional UI animations and visual polish

## API

Pokémon data is provided by [PokéAPI](https://pokeapi.co/).