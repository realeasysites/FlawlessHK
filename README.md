# Flawless Housekeeping — Static Site (Render)

Plain HTML/CSS/JS with no server, no database and no npm install. The quote form emails requests through **Web3Forms**.

## 1. Get the form key (2 minutes)
1. Go to https://web3forms.com, enter the inbox that should receive quote requests, and click **Create Access Key**. The key is emailed to that inbox.
2. Open `js/main.js` and paste the key into `const WEB3FORMS_KEY = '...'`.
3. Free plan: 250 submissions/month. The key is meant to be public in the page source, so that's normal.

## 2. Deploy on Render
1. Upload everything in this folder to the **root** of a new GitHub repo, so `index.html` sits at the top level.
2. In Render, click **New → Static Site** and connect the repo.
   - Build Command: leave **blank**
   - Publish Directory: `.`
3. Optional: to make bad links show the custom 404 page, go to **Redirects/Rewrites** and add Source `/*` → Destination `/404.html` → Action **Rewrite**. Existing files still load normally. Test a fake URL after you add it.
4. Custom domain: go to **Settings → Custom Domains**, add `www.yourdomain.com` and the root domain, then add the DNS records Render shows at the registrar. SSL is automatic.

## 3. Visitor stats (optional, free)
Static hosting has no lead dashboard. For page views:
1. Create a free Cloudflare account, go to **Web Analytics → Add a site**, and enter the domain.
2. Copy the `<script ... beacon.min.js ...>` snippet it gives you and paste it in `index.html` where the comment says "Visitor stats", just above `</body>`.

## Updating the site
Edit files and push to GitHub. Render redeploys automatically in about 30 seconds.
