# Use a live Netlify site while you build locally

Think of the app as a teacher calling the front office for help. When you run `netlify dev`, the front office sits on your laptop. If you can’t run that helper, you can instead call the copy that already lives on Netlify by telling the app where that office is.

## Step 1 – make sure the Netlify site knows your secrets

Open your Netlify site settings and add the same hidden keys you would use on your laptop:

- All of the `FIREBASE_*` values (they prove who you are when the function checks your login).
- `GEMINI_API_KEY` (plus optional `GEMINI_MODEL` or `GEMINI_API_VERSION`).

No secrets on the site = no access to your class list or Gemini, so the request fails.

## Step 2 – give the browser the address of that site

Create or update your local `.env` file and add the usual Firebase values **plus** the URL of your Netlify site:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FUNCTION_BASE_URL="https://your-site-name.netlify.app"
```

You are simply writing down the phone number of the remote front office so the app knows where to call.

## Step 3 – run Vite like normal

Install dependencies (`npm install`) and start the app with `npm run dev`. Because `VITE_FUNCTION_BASE_URL` is set, the browser automatically forwards quiz requests to the live Netlify site. That site already has your secrets, so it can talk to Gemini and send the results back.

## Step 4 – double-check it’s working

Trigger a quiz in the browser and look at the URL in the network tab. You should see the request hitting your Netlify site. If something comes back with a 400 error, the message will spell out what information is missing (for example, “please pick a standard” or “sign in again”).

## Switching back to your laptop later

Remove or comment out `VITE_FUNCTION_BASE_URL` and run `npx netlify-cli dev`. That brings the helper back to your machine so you can see live logs in the terminal.
