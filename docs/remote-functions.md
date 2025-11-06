# Use a live Netlify site while you build locally

Think of the app as a teacher calling the front office for help. When you run `netlify dev`, the front office sits on your laptop. If you can’t run that helper, you can instead call the copy that already lives on Netlify by telling the app where that office is.

## Step 1 – give the Netlify site the same secret notes

Imagine you’re leaving town and asking the school office to answer calls for you. You would hand them the class list and the number for Gemini so they can finish the job. Do the same thing here:

- Add every `FIREBASE_*` value to your Netlify site (Settings → Build & deploy → Environment). These prove to the function that the caller is really you.
- Add `GEMINI_API_KEY` (and optional `GEMINI_MODEL`, `GEMINI_API_VERSION`). That’s the phone number the function dials to reach Gemini.

No secret notes on the site means the remote helper answers the phone but can’t look up your students or call Gemini back, so the quiz fails.

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

Trigger a quiz in the browser and look at the URL in the network tab. You should see the request hitting your Netlify site instead of `localhost`. When the call finds that remote helper, the 404 “Gemini request failed” message disappears because the function is now reachable. If something comes back with a 400 error, the message will spell out what information is missing (for example, “please pick a standard” or “sign in again”).

## Switching back to your laptop later

Remove or comment out `VITE_FUNCTION_BASE_URL` and run `npx netlify-cli dev`. That brings the helper back to your machine so you can see live logs in the terminal.

## FAQ – “Do I really have to add the secrets to Netlify?”

Yes. When you lean on the remote Netlify site, that site becomes the one phoning Gemini and peeking at your Firestore records. If it doesn’t have the Firebase IDs or the Gemini key, it’s like asking the office to help without giving them the binder—they’ll answer, shrug, and the request stops there. Once you copy the same secrets over, the remote helper knows exactly who’s calling and can finish the quiz without you running Netlify locally.
