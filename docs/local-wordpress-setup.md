# Local WordPress Setup Guide

This guide explains how to set up a local WordPress + WooCommerce backend for this project, including what to download and where to configure each part.

## 1) Software to Install

- Local (LocalWP): https://localwp.com/
- Node.js LTS: https://nodejs.org/
- Git: https://git-scm.com/downloads
- Visual Studio Code: https://code.visualstudio.com/
- ngrok (optional for sharing localhost): https://ngrok.com/download

Optional tools:
- Postman (API testing): https://www.postman.com/downloads/
- Bruno (lightweight API client): https://www.usebruno.com/

---

## 2) Create a Local WordPress Site (LocalWP)

1. Open LocalWP.
2. Click **Create a New Site**.
3. Site name example: `test-wp-bearbricks-shop`.
4. Choose preferred environment (default is fine).
5. Set WordPress admin username/password/email.
6. Finish setup and start the site.

After creation, LocalWP gives two important URLs:
- Site domain, e.g. `https://test-wp-bearbricks-shop.local`
- Admin URL, e.g. `https://test-wp-bearbricks-shop.local/wp-admin`

---

## 3) Initial WordPress Configuration

In WordPress admin:

1. **Settings → Permalinks**
   - Choose **Post name**.
2. **Enable SSL in LocalWP** for the site (Trust certificate on Windows when prompted).
3. Verify API base works:
   - Open `https://your-site.local/wp-json`

---

## 4) Install and Configure WooCommerce

1. Install plugin: **WooCommerce**
2. Complete onboarding wizard (basic values are fine for local dev).
3. Create API credentials:
   - **WooCommerce → Settings → Advanced → REST API → Add key**
   - Permissions: `Read/Write`
   - Save `Consumer key` and `Consumer secret`

Use these values in project `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.local/
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If LocalWP SSL is self-signed, keep this for local dev only:

```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

---

## 5) Install and Configure JWT Auth (for custom Next.js login/register)

Install plugin in WP admin:
- **JWT Authentication for WP REST API** by tmeister

Then edit WordPress config file:
- Path (LocalWP): `Local Sites/<site-name>/app/public/wp-config.php`
- Add above the “stop editing” line:

```php
define('JWT_AUTH_SECRET_KEY', 'your-long-random-secret-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

Restart site in LocalWP after editing `wp-config.php`.

JWT endpoint:
- `POST https://your-site.local/wp-json/jwt-auth/v1/token`

Request body:

```json
{
  "username": "admin",
  "password": "your-password"
}
```

Successful response returns token + user data.

---

## 6) Add Sample Products for Frontend Testing

Option A (fast):
- **WooCommerce → Status → Tools → Create customer and product data**

Option B:
- **Products → Import** using WooCommerce sample CSV

Ensure products are `Published` and have prices/images.

---

## 7) Run This Next.js Project Against Local WordPress

In this repository:

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open:
   - `http://localhost:3000`

Optional public tunnel:

1. Terminal A:
   - `npm run dev`
2. Terminal B:
   - `ngrok http 3000`
3. Use the `https://*.ngrok-free.app` forwarding URL.

---

## 8) Quick Verification Checklist

- `https://your-site.local/wp-json` returns JSON
- WooCommerce API key works for:
  - `/wp-json/wc/v3/products`
- Product images load in Next.js (host allowed in `next.config.ts`)
- JWT token endpoint returns token:
  - `/wp-json/jwt-auth/v1/token`

---

## 9) Common Issues

### 401 on WooCommerce API
- Confirm `https://` base URL in `.env.local`
- Re-check consumer key/secret
- Ensure permalinks are not “Plain”

### JWT plugin says “Not Configured”
- Confirm constants are in `wp-config.php`
- Restart LocalWP site after editing config

### SSL certificate errors
- Trust LocalWP certificate
- Keep `NODE_TLS_REJECT_UNAUTHORIZED=0` only for local development

### Next.js image host error
- Ensure WordPress hostname is present in `images.remotePatterns` in `next.config.ts`

---

## 10) Moving Later to Alibaba Cloud WordPress

When you are ready to replace LocalWP with Alibaba Cloud WordPress, keep this order:

1. Provision WordPress on Alibaba Cloud (ECS or managed WordPress service).
2. Install SSL certificate and force HTTPS.
3. Install WooCommerce + JWT plugin again on cloud WordPress.
4. Recreate WooCommerce REST API keys (do not reuse local keys).
5. Copy your products/media/database from local to cloud.
6. Update this project `.env.local` (or deployment env vars):

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-cloud-domain.com/
WC_CONSUMER_KEY=ck_new_cloud_key
WC_CONSUMER_SECRET=cs_new_cloud_secret
```

7. Remove local-only TLS bypass:
   - Delete `NODE_TLS_REJECT_UNAUTHORIZED=0`
8. Update WordPress `wp-config.php` JWT secret on cloud:

```php
define('JWT_AUTH_SECRET_KEY', 'new-strong-random-production-secret');
define('JWT_AUTH_CORS_ENABLE', true);
```

9. Test endpoints on cloud:
   - `/wp-json`
   - `/wp-json/wc/v3/products`
   - `/wp-json/jwt-auth/v1/token`
10. Rebuild and redeploy Next.js app so `next.config.ts` picks up the new image hostname.

Alibaba Cloud references:
- ECS: https://www.alibabacloud.com/product/ecs
- SSL Certificates: https://www.alibabacloud.com/product/ssl-certificates-service

---

## 11) Production Notes

- Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0` in production.
- Use a strong random `JWT_AUTH_SECRET_KEY`.
- Keep WP and plugin versions updated.
- Restrict API credentials and rotate secrets periodically.
