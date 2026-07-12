# Pulse HR — Analytics Dashboard

Ready-to-deploy React + Vite project. Run these commands in order.

## 1. Install and test locally
```bash
npm install
npm run dev
```
Opens at http://localhost:5173 — confirm it looks right before deploying.

## 2. Push to GitHub
```bash
git init
git add .
git commit -m "HR analytics dashboard"
git branch -M main
git remote add origin https://github.com/Elamkavi518/hr-analytics-dashboard.git
git push -u origin main
```
(Create the empty repo first at github.com/new, name it `hr-analytics-dashboard`, then run the commands above. Or use GitHub Desktop: File → Add Local Repository → select this folder → Publish.)

## 3. Deploy to Vercel (free, ~2 minutes)
1. Go to vercel.com → sign in with your GitHub account
2. Click "Add New Project" → select `hr-analytics-dashboard`
3. Vercel auto-detects Vite — leave all settings default
4. Click Deploy
5. You get a live URL like `hr-analytics-dashboard.vercel.app`

That URL is what you send the client — works on any device, no localhost, no code needed on their end.

## 4. Custom domain (optional, makes it look like a delivered product)
In Vercel: Project → Settings → Domains → add your domain (e.g. `hr.yourname.com` or a client-specific subdomain like `clientname-hr.yourname.com`).

## 5. Per-client delivery
When you land a real client:
1. Duplicate this folder (or branch the repo)
2. Replace the mock data arrays at the top of `src/App.jsx` with their real numbers (or wire to their API/Google Sheet)
3. Swap "Pulse HR" branding for theirs in `App.jsx` (search for "Pulse HR")
4. Push to a new repo → deploy to a new Vercel project → hand over that URL
