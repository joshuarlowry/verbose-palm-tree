# Complex Form Example (React + Vite + TS)

A minimal sample app showcasing a complex form built with Formik, Yup, Redux Toolkit, and a searchable dropdown using `react-select`. Includes dependent fields (e.g., show an "Other" text input when the selected option is "Other", and cascading country → state/province).

## Features
- Formik for form state and submission
- Yup for schema validation
- Redux Toolkit to store previous submissions
- `react-select` for searchable single/multi dropdowns
- Dependent fields: category "Other", country "Other", and country → state with state "Other"

## Getting Started

```bash
npm install
npm run dev
```

- App runs at `http://localhost:5173`.
- Submit the form to see entries saved under Submissions (kept in Redux in-memory).

## Build

```bash
npm run build
npm run preview
```

## Tech
- React 18 + TypeScript
- Vite 5
- Redux Toolkit
- Formik + Yup
- react-select
