
# CSTU Computer & Programming Club

The CSTU Computer & Programming Club (CPC) platform is a Next.js application for publishing club content, accepting membership applications, managing members, and organizing competitive programming contests.

## What It Provides

- Public pages for notices, events, contests, contest results, advisors, members, and the gallery.
- Public membership registration with admin review and approval.
- Credentials-based login for administrators and members.
- An admin portal for members, join applications, notices, events, contests, contest applications, and results.
- A member portal for profile management, membership applications, contest registration, dashboard statistics, and downloadable credentials.
- MongoDB persistence through Mongoose.
- Optional Cloudflare R2 storage for profile images, event images, attachments, and other uploads.

## Technology

- Next.js `16.3.0` with the App Router
 | --- | --- |
- NextAuth `4.24.15` with a credentials provider and JWT sessions
- MongoDB and Mongoose
- Tailwind CSS v4
- Cloudflare R2 through the AWS S3 SDK
- React Hook Form, Zod, Lucide React, html2canvas, and jsPDF

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- A MongoDB database, local or hosted
- Cloudflare R2 credentials if file uploads are enabled

## Installation

```bash
npm install
```

Create a `.env` file in the project root. Do not commit it.

 | --- | --- |
# Database. MONGODB_URL is preferred; MONGODB_URI is also supported.
MONGODB_URL=mongodb://localhost:27017/cpc

# Used by NextAuth for signing JWT sessions.
NEXTAUTH_SECRET=replace-with-a-long-random-secret

# Used by npm run seed:admin. Defaults exist, but set these explicitly.
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password

# Required by the upload route when Cloudflare R2 is used.
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=cpc
R2_PUBLIC_URL=https://your-public-file-domain.example.com
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after a build. |
| `npm run lint` | Run ESLint. |
| `npm run seed` | Create or update the admin account. |
| `npm run seed:admin` | Alias for `npm run seed`. |

After configuring MongoDB and the admin credentials, initialize the admin account with:

```bash
npm run seed:admin
```

The seed script is idempotent for the configured admin email: an existing account is updated to `ADMIN` and `ACTIVE`, while a missing account is created.

## Application Routes

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Club home page and featured content. |
| `/members` | Active member directory. |
| `/advisors` and `/advisor` | Advisor information. |
| `/notices` | Published notices. |
| `/events` | Active club events. |
| `/contests` | Contests and public standings. |
| `/gallery` | Club gallery. |
| `/join` | Membership registration form. |
| `/login` | Admin and member login. |

### Admin routes

Admin routes require an authenticated user with `role: "ADMIN"`.

| Route | Purpose |
| --- | --- |
| `/admin/dashboard` | Admin statistics and recent activity. |
| `/admin/applications` | Review, approve, reject, or remove join applications. |
| `/admin/members` | Create, update, deactivate, and remove users. |
| `/admin/notices` | Manage notices and attachments. |
| `/admin/events` | Manage events and registration links. |
| `/admin/contests` | Manage contests, applications, and results. |

### Member routes

Member routes require an authenticated user. Admins can also authenticate, but the UI directs each role to its own dashboard.

| Route | Purpose |
| --- | --- |
| `/member/dashboard` | Member summary and profile information. |
| `/member/profile` | Edit the signed-in member profile. |
| `/member/applications` | View membership and contest application activity. |
| `/member/credential` | View and download the member credential card. |

## API Reference

API responses generally use `{ success, data }` on success and `{ success: false, error }` on failure.

### Public API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/public/members` | List public members; supports `status` and `role` query parameters. |
| `GET` | `/api/public/notices` | List public notices. |
| `GET` | `/api/public/notices/:id` | Read one notice. |
| `GET` | `/api/public/events` | List active events. |
| `GET` | `/api/public/events/:id` | Read one event. |
| `GET` | `/api/public/contests` | List public contests. |
| `GET` | `/api/public/contests/:id` | Read one contest. |
| `GET` | `/api/public/contests/:id/results` | Read public contest results. |
| `POST` | `/api/public/join` | Submit a membership application. |

### Admin API

All `/api/admin/*` endpoints require an authenticated admin session.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/dashboard` | Return admin dashboard statistics. |
| `GET` | `/api/admin/members` | List members. |
| `POST` | `/api/admin/members` | Create a member or admin account. |
| `GET` | `/api/admin/members/:id` | Read one member. |
| `PUT` | `/api/admin/members/:id` | Update one member. |
| `DELETE` | `/api/admin/members/:id` | Delete one member. |
| `GET` | `/api/admin/applications` | List join applications; supports `status`. |
| `PUT` | `/api/admin/applications/:id` | Update application status or approve an applicant. |
| `DELETE` | `/api/admin/applications/:id` | Delete an application. |
| `GET` / `POST` | `/api/admin/notices` | List or create notices. |
| `GET` / `PUT` / `DELETE` | `/api/admin/notices/:id` | Read, update, or delete a notice. |
| `GET` / `POST` | `/api/admin/events` | List or create events. |
| `GET` / `PUT` / `DELETE` | `/api/admin/events/:id` | Read, update, or delete an event. |
| `GET` / `POST` | `/api/admin/contests` | List or create contests. |
| `GET` / `PUT` / `DELETE` | `/api/admin/contests/:id` | Read, update, or delete a contest. |
| `GET` / `PATCH` | `/api/admin/contests/:id/applications` | List or update contest applications. |
| `GET` / `POST` | `/api/admin/contests/:id/results` | List or create contest results. |

### Member and utility API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/member/dashboard` | Return the signed-in member dashboard. |
| `GET` | `/api/member/applications` | Return the signed-in member's applications. |
| `POST` | `/api/member/contests/:id/apply` | Apply to a contest. |
| `GET` / `PUT` | `/api/member/profile/:id` | Read or update a member profile. |
| `POST` | `/api/upload` | Upload a multipart file to Cloudflare R2. Field name: `file`. |
| `GET` | `/api/image-proxy?url=...` | Proxy an image URL for credential rendering. |

Authentication is handled by NextAuth at `/api/auth/[...nextauth]` using email and password credentials. The JWT includes the user id, role, student id, department, designation, and avatar URL.

## Data Model

The Mongoose models are in `src/models`:

- `User`: account, role, academic information, contact information, programming handles, avatar, and active status.
- `JoinApplication`: public membership application, payment details, review status, and admin remarks.
- `Notice`: title, content, category, pin state, attachment, and author.
- `Event`: title, description, venue, date, cover image, registration link, and active state.
- `Contest`: title, description, platform, external contest URL, dates, and lifecycle status.
- `ContestApplication`: contest participant, team name/members, status, and remarks.
- `ContestResult`: contest participant, solved problem count, rating, rank, and remarks.

## Project Structure

```text
src/
	app/                 App Router pages, layouts, and route handlers
		(public)/          Public website pages
		(member)/          Member portal pages
		(admin)/           Admin portal pages
		api/               Server-side API route handlers
	components/          Shared client components
	lib/                 Database, authentication, storage, and shared helpers
	models/              Mongoose schemas
	data/                Static content such as gallery data
scripts/
	seed-admin.js        Admin account initialization script
public/                Static assets
```

## Authentication and Authorization

`src/proxy.js` protects `/admin`, `/member`, and `/dashboard` paths before the request reaches the page. Unauthenticated users are redirected to `/login` with a callback URL. Non-admin users attempting to open `/admin` are redirected to `/member/dashboard`.


API handlers perform their own authorization checks with the NextAuth session or JWT. Keep both layers in place when adding a protected page or endpoint.

## File Uploads

`POST /api/upload` accepts a multipart form field named `file` and sends it to the configured R2 bucket under an `uploads/` key. When `R2_PUBLIC_URL` is set, the returned URL uses that public base URL. Without it, the helper returns an `/api/files/...` fallback path; this fallback route is not currently implemented, so public R2 URLs should be configured for production uploads.

## Deployment

Set all production environment variables in the hosting provider, including `NEXTAUTH_SECRET`, `MONGODB_URL`, and the R2 values when uploads are used. Then run:

```bash
npm ci
npm run build
npm run start
```

For Vercel or another Next.js host, use the same environment variables and configure the project to run the standard Next.js build command.

## Development Notes










