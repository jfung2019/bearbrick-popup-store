# Self-Hosted Fonts

This directory contains locally hosted font files for **China GFW compliance** (no external CDN requests).

## Required Files

Download **Geist fonts** from [Vercel Font](https://vercel.com/font) and place them here:

### Geist Sans (Primary UI Font)
- `Geist-Regular.woff2` (400 weight)
- `Geist-Medium.woff2` (500 weight)
- `Geist-SemiBold.woff2` (600 weight)
- `Geist-Bold.woff2` (700 weight)

### Geist Mono (Code/Monospace Font)
- `GeistMono-Regular.woff2` (400 weight)
- `GeistMono-Medium.woff2` (500 weight)
- `GeistMono-SemiBold.woff2` (600 weight)
- `GeistMono-Bold.woff2` (700 weight)

## Download Instructions

1. Visit https://vercel.com/font
2. Download both **Geist** and **Geist Mono** font packages
3. Extract the `.woff2` files from the downloaded archives
4. Place all 8 `.woff2` files in this directory

## Alternative Download Sources

If Vercel's website is blocked, you can:

1. **npm package**: `npm install geist` (fonts in `node_modules/geist/dist/fonts/`)
2. **GitHub Release**: https://github.com/vercel/geist-font/releases

## File Structure

```
public/fonts/
├── Geist-Regular.woff2
├── Geist-Medium.woff2
├── Geist-SemiBold.woff2
├── Geist-Bold.woff2
├── GeistMono-Regular.woff2
├── GeistMono-Medium.woff2
├── GeistMono-SemiBold.woff2
└── GeistMono-Bold.woff2
```

## China-Safe Fallbacks

If fonts fail to load, the following system fonts will be used:

- **Sans-serif**: PingFang SC → Hiragino Sans GB → Microsoft YaHei → sans-serif
- **Monospace**: Menlo → Monaco → Courier New → monospace

## Testing

After adding fonts, verify they load correctly:

```bash
npm run build
npm start
```

Check browser DevTools Network tab - there should be **NO** requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
