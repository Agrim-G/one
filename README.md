# UrbanThread

A streetwear clothing store built with plain HTML, CSS and JavaScript. There is no build step, no backend and no API keys, so it deploys as a static site.

## What is inside

```
index.html      the page shell (header, footer)
css/style.css   all styling
js/app.js       products, cart, checkout and page routing
```

Features: product catalogue, category filters, search, price sorting, product pages with sizes, a cart saved in your browser (localStorage), and a simulated checkout. No payment is taken.

## Run it locally

Open `index.html` in your browser. That is all.

## Deploy

### 1. Put it on GitHub

1. Create a new repository on github.com (for example `urbanthread`).
2. Click **uploading an existing file**, drag in everything from this folder (`index.html`, `css`, `js`, `README.md`) and click **Commit changes**.

### 2a. Deploy on Netlify

1. Go to app.netlify.com and choose **Add new site > Import an existing project**.
2. Connect GitHub and pick your repository.
3. Leave **Build command** empty and set **Publish directory** to `.` (or leave it blank).
4. Click **Deploy**. Your site is live in about a minute.

### 2b. Deploy on Vercel

1. Go to vercel.com/new and import your GitHub repository.
2. Set **Framework Preset** to **Other**. Leave **Build Command** and **Output Directory** empty.
3. Click **Deploy**.

## Customise

- **Products and prices:** edit the `PRODUCTS` list at the top of `js/app.js`.
- **Product photos:** change the `img` value of a product to any image URL, or add images to an `images/` folder and use paths like `images/hoodie.jpg`. If a photo fails to load, a branded placeholder appears automatically.
- **Colours and fonts:** edit the variables at the top of `css/style.css`.
