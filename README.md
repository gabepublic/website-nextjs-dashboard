# website-nextjs-dashboard

Clone from Next.js tutorial github vercel/next-learn

Doc: https://nextjs.org/docs

## SETUP

- Prerequisite: Nodejs

- Install & use [pnpm](https://pnpm.io/)
```
npm install -g pnpm
```

- To recreate this project from scratch - clone from vercel github;
  This project was renamed from the original `nextjs-dashboard`
```
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
```

- Install the project package
```
pnpm i
```

- Recommended development environment for Windows laptop is: to clone 
  this repo to the Windows WSL; then use VS Code with remote connection
  to WSL to open the cloned folder in the WSL.

- For Postgres database
```
pnpm i @vercel/postgres
```

- For Debouncing
```
pnpm i use-debounce
```

- For Authentication and Authorization
```
pnpm i next-auth@beta
```


## DEVELOP

- Open the project using VS Code remote connection to WSL folder

- - For linting
```
pnpm lint
```

- From terminal, run this app and open browser
```
pnmp dev

> @ dev ~/nextproject/website-nextjs-dashboard
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
```

- CSS Styles: 
  - Global styles: [Tailwind](https://tailwindcss.com/)
```
# File: /app/layout.tsx
import '@/app/ui/global.css';

# File: /app/ui/global.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# File: /app/page.tsx
<main className="flex min-h-screen flex-col p-6">
```

  - Custom style
```
# File: /app/ui/home.module.css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}

# File: /app/page.tsx
import styles from '@/app/ui/home.module.css';
<div className={styles.shape} />
```

  - Style toogle `clsx`
```
# File: /app/ui/invoices/status.tsx
import clsx from 'clsx';
<span
  className={clsx(
    'inline-flex items-center rounded-full px-2 py-1 text-sm',
    {
      'bg-gray-100 text-gray-500': status === 'pending',
      'bg-green-500 text-white': status === 'paid',
    },
  )}
>
```

- Fonts - specify two fonts
```
# File: /app/ui/fonts.ts
import { Inter, Lusitana } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

# File: /app/page.tsx
import { lusitana } from '@/app/ui/fonts';
<p
  className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
>
```

- Image
```
# File: /app/page.tsx
import Image from 'next/image';
<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

- Layouts and Pages
  - Next.js uses file-system routing where **folders** are used to create 
    nested routes. Each folder represents a route segment that maps to 
    a URL segment.
  - Each route using `layout.tsx` and `page.tsx`
  - `page.tsx` is a special Next.js file that exports a React component, 
    and it's required for the route to be accessible.
  - `layout.tsx` file to create UI that is shared between multiple pages.

- Navigation using `<Link />`
```
# File: /app/ui/dashboard/nav-links.tsx
import Link from 'next/link';
export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

- Setup and test Postgres DB on Vercel
  - source: https://nextjs.org/learn/dashboard-app/setting-up-your-database

- Route Handlers allow you to create custom request handlers for a given
  route using the Web Request and Response APIs.
  - Use API to avoid connecting direcly to DB and exposing secret
    information to the client
  - Use ORM to minimize writing SQL; 
    see https://vercel.com/docs/storage/vercel-postgres/using-an-orm
  - React Server Components (fetching data on the server), so you can 
    skip the API layer, and query your database directly without 
    risking exposing your database secrets to the client.
  - Using proprietary [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)
```
# File: /app/lib/data.ts
import { sql } from '@vercel/postgres';

# File: /app/dashboard/page.tsx
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```
  - Waterfall refers to a sequence of network requests that depend on 
    the completion of previous requests.
```
# File: /app/dashboard/page.tsx
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
```
  - Parallel data fetching. In JavaScript, you can use the `Promise.all()`
    or `Promise.allSettled()` functions to initiate all promises at the 
    same time. For example, in data.ts, we're using `Promise.all()` in 
    the `fetchCardData()` function:
```
# File: /app/lib/data.ts
const data = await Promise.all([
  invoiceCountPromise,
  customerCountPromise,
  invoiceStatusPromise,
]);
```
  - CONSEQUENCE: if one call can slow down, try use streaming
  - Also see React Server Actions below

- Streaming a WHOLE page - there are two ways you implement streaming 
  in Next.js:
  - At the page level, with the `loading.tsx` file.
  - For specific components, with `<Suspense>`.
  - The user doesn't have to wait for the page to finish loading before
    navigating away (this is called interruptable navigation).

- Route Group allow you to organize files into logical groups without 
  affecting the URL path structure, for example, a folder `(overview)`
  - It also mitigates the `loading.tsx` impact to subpages like
    "customers" and "invoices"
  - By moving and grouping the `dashboard/page.tsx` and `dashboard/loading.tsx`
    to the `(overview)` folder, the loading behavior only applies to the
    `page.tsx`

- Streaming a COMPONENT only - using React Suspense
  - Requires code refactoring; moving data fetch to the component
  - See https://nextjs.org/learn/dashboard-app/streaming
  - See refactoring of `RevenueChart` in `dashboard/(overview)page.tsx`
    `ui/dashboard/revenue-chart.tsx`

- Streaming Group of Components
  - Refactor `<Card>` in `dashboard/(overview)page.tsx`

- Search and Pagination - see https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
  - Use hooks: 
  - `useSearchParams` - allows you to access the parameters of the 
    current URL.
  - `usePathname` - returns the current URL's pathname.
  - `useRouter` - Enables navigation between routes within client 
    components programmatically. There are multiple methods you can use.

- `useSearchParams()` vs `searchParams`
  - used the `useSearchParams()` hook to access the params from the 
    client; see `search.tsx`
  - use `searchParams` for Server Component that fetches its own data, 
    so you can pass the searchParams prop from the page to the 
    component. see `table.tsx`
  - to read the params from the client, use the useSearchParams() hook 
    as this avoids having to go back to the server.

- Debouncing - because of the use of `<input onChange>` and `useRouter()`
  every input character resulted in a call to server and database. 
  You're updating the URL on every keystroke, and therefore querying 
  your database on every keystroke! 
  - Debouncing is a programming practice that limits the rate at which 
    a function can fire. In our case, you only want to query the 
    database when the user has stopped typing. It works as follow:
  - Trigger Event: When an event that should be debounced (like a 
    keystroke in the search box) occurs, a timer starts.
  - Wait: If a new event occurs before the timer expires, the timer is 
    reset.
  - Execution: If the timer reaches the end of its countdown, the 
    debounced function is executed.
  - Use the library called `use-debounce`

- React Server Action - allow you to run asynchronous code directly on 
  the server. They eliminate the need to create API endpoints to mutate
  your data. Instead, you write asynchronous functions that execute on 
  the server and can be invoked from your Client or Server Components.
  - They offer an effective security solution, protecting against 
    different types of attacks, securing your data, and ensuring 
    authorized access. Server Actions achieve this through techniques 
    like POST requests, encrypted closures, strict input checks, error 
    message hashing, and host restrictions, all working together to 
    significantly enhance your app's safety.
  - Server Actions are also deeply integrated with Next.js caching. 
    When a form is submitted through a Server Action, not only can you 
    use the action to mutate data, but you can also revalidate the 
    associated cache using APIs like `revalidatePath` and `revalidateTag`.

- Form & Form submit Server Action
  - The form is a route, so need to create a subfolder `invoice/create`
  - For submit server action, see `lib/actions.ts`
  - Submit pass the `FormData`, that can be serialized using:
```
const rawFormData = Object.fromEntries(formData.entries())
```
  - The FormData type should be validated against `lib/definitions.ts`,
    or using a library like [Zod](https://zod.dev/); see `actions.ts`
  - Insert data to Postgres db using vercel sdk; see `actions.ts`
  - Next.js has a Client-side Router Cache that stores the route segments
    in the user's browser for a time. Along with prefetching, this cache
    ensures that users can quickly navigate between routes while reducing
    the number of requests made to the server. Once the database has 
    been updated, the /dashboard/invoices path will be revalidated, and 
    fresh data will be fetched from the server.
  - you also want to redirect the user back to the /dashboard/invoices 
    page.
```
revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
``` 

Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 

- Example of React [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
  for comparison with Server Action.
```
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

- Form edit/update also a route similar to form create, but it requires
  a unique id of the item to update. So, it is a Dynamic Route that
  needs to create a subfolder with name in square bracket, for example,
  `[id]`, `[post]`, etc.

- Error handling using: `try/catch`, `error.tsx`, or `notfound()` 
```
import { notFound } from 'next/navigation';
if (!invoice) {
  notfound()
}
```

- Accessibility using the `eslint-plugin-jsx-a11y` plugin
  see https://nextjs.org/learn/dashboard-app/improving-accessibility

- Form validation: client and/or server
  - CLient side using, for example, `required`; see `create-form.tsx`

- Authentication & Authorization
  see: https://nextjs.org/learn/dashboard-app/adding-authentication
  - Using various providers: https://authjs.dev/getting-started/authentication/oauth

- 