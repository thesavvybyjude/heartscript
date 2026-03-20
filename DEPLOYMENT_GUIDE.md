# HeartScript Deployment Guide 🚀

This guide explains how to take HeartScript from your local machine and deploy it to **Vercel** so anyone in the world can use it!

Because HeartScript uses a modern Vite (React) frontend and a Supabase backend, Vercel is the perfect free hosting platform.

---

## Step 1: Push your code to GitHub
Before Vercel can host your app, your code needs to be on GitHub.
1. Create a new empty repository on [GitHub](https://github.com).
2. Open your terminal in the `Heartscript` folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Import to Vercel
1. Go to [Vercel.com](https://vercel.com/) and sign up or log in.
2. Click **Add New...** and select **Project**.
3. Connect your GitHub account and select your newly created `Heartscript` repository.
4. Vercel will automatically detect that you are using `Vite`.
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

## Step 3: Add Environment Variables 🔐
**CRITICAL:** Do NOT click Deploy yet! HeartScript needs your Supabase keys to connect to the database.
1. On the Vercel import screen, click the **Environment Variables** dropdown.
2. Open the `.env` file on your local computer.
3. Add the two variables exactly as they appear in your file:
   - **Name:** `VITE_SUPABASE_URL`, **Value:** `https://your-project-id.supabase.co`
   - **Name:** `VITE_SUPABASE_ANON_KEY`, **Value:** `your-long-anon-key`
4. Click **Add** for each one.

## Step 4: Deploy and Verify
1. Once your variables are added, click **Deploy**.
2. Vercel will take about 60 seconds to build your application.
3. When it's finished, you'll receive a live URL (e.g., `https://heartscript-yourname.vercel.app`).
4. Click the URL and verify that the splash screen loads!

---

## Step 5: Update Supabase Authentication Settings ⚙️
Now that your app is live on a `.vercel.app` URL instead of `localhost`, you need to tell Supabase that this new URL is permitted to log in users.

1. Log into your **Supabase Dashboard**.
2. Go to **Authentication** (the lock icon on the left).
3. Under the **Configuration** section, click **URL Configuration**.
4. In the **Site URL** box, paste your new Vercel URL (e.g., `https://heartscript-yourname.vercel.app`).
5. Under **Redirect URLs**, click **Add URL**, paste the exact same Vercel URL, and click Save.

### Important: Supabase Email Confirmation
Because you are now live, if you want users to be able to sign up immediately without waiting for an email link:
1. Go to **Authentication > Providers > Email**.
2. Ensure **Confirm email** is toggled **OFF**, then hit **Save**.

### ⚠️ Don't Forget the Expiry Database Script
If you created a fresh Supabase project for Production, ensure you run the SQL required for the Expiry feature in the SQL Editor:
```sql
ALTER TABLE public.heartscripts ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
```

---

## You're Done! 🎉
You can now share your Vercel URL with the world. Anyone can create an account, craft a HeartScript, and send encrypted romantic messages. When they push updates to your `main` branch on GitHub, Vercel will automatically rebuild and deploy the changes!
