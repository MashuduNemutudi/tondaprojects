# Tonda Consultancy & Projects

A responsive React and Vite website with a Vercel serverless contact endpoint. Contact enquiries are sent through Resend; credentials are kept on the server and are never included in the frontend.

## Run the website locally

1. Install Node.js LTS.
2. Run `npm install`.
3. Run `npm run dev` to work on the Vite frontend.

To test the contact endpoint locally, use the Vercel development server instead:

1. Copy `.env.example` to `.env.local` and fill in the values below.
2. Run `npx vercel dev` from the project directory.
3. Open the local URL printed by Vercel.

Vercel CLI may ask you to sign in and link the project. The plain Vite development server does not run files in `api/`.

## Configure Resend

1. Create a Resend account and an API key with permission to send email.
2. Add and verify a domain in Resend. Follow Resend's DNS instructions before sending from that domain.
3. Set these environment variables in the local `.env.local` file and in the Vercel project's **Settings → Environment Variables**:

   | Variable | Purpose |
   | --- | --- |
   | `RESEND_API_KEY` | Secret Resend API key. Keep it server-side; never add it to a `VITE_` variable. |
   | `TONDA_TO_EMAIL` | Must be `info@tondaprojects.co.za`, the company inbox for website enquiries. |
   | `TONDA_FROM_EMAIL` | Sender identity on the domain verified with Resend, for example `Tonda Consultancy <website@your-verified-domain.com>`. |

4. Configure the variables for the Vercel environments you use (Development, Preview, and Production), then redeploy after changing them.
5. Submit a test enquiry from the deployed site and confirm it arrives in the configured inbox. Replies use the visitor's email address.

The API responds with an error when the environment is incomplete, the recipient is not `info@tondaprojects.co.za`, or Resend cannot deliver the email. Until the Resend key and sender domain are configured, use `info@tondaprojects.co.za` directly.

For an existing Vercel deployment, update **Settings → Environment Variables → `TONDA_TO_EMAIL`** to `info@tondaprojects.co.za` in each enabled environment (Production, Preview, and Development), then redeploy. The API rejects a mismatched recipient rather than sending enquiries to a previously configured inbox.

## Build and deploy

- `npm run build` creates the production site in `dist/`.
- Import the project into Vercel. The included `vercel.json` configures the Vite build and output directory; Vercel deploys `api/contact.js` as a serverless function.
- Add the three Resend environment variables in Vercel before testing the contact form.

The contact API is kept separate from the React UI, allowing future enquiry storage, status tracking, notifications, and other business-system integrations without coupling them to the website.

## Company assets

The brochure PDF supplied for this project is the source for the company description, legislation, contact information, service list, logo and website photographs. The brochure logo and selected photographs are stored as local, optimised assets in `src/assets/`; no unrelated stock-photo service is used.

## Security and source control

- `.env` files, dependencies, build output, and Vercel local state are excluded by `.gitignore`.
- Never commit real Resend keys or put secrets in frontend variables.
- The contact endpoint validates inputs, checks a honeypot field, limits field lengths, and only sends known service selections.
