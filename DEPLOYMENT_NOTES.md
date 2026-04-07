# Deployment Notes - Dublin Property Portal

## Build Status: ✅ Successful

The project builds successfully and is ready for deployment.

---

## Important Package Versions

### react-map-gl Version
**Current**: `7.1.7` (locked)

**Why this version?**
- react-map-gl v8.x has compatibility issues with Vite 7.x
- v7.1.7 is stable and works perfectly with our setup
- All features we need are available in v7.1.7

**Do NOT upgrade** to v8.x until Vite compatibility is resolved.

---

## Build Configuration

### Vite Config Optimizations
```typescript
optimizeDeps: {
  include: ['react-map-gl', 'mapbox-gl']
},
build: {
  commonjsOptions: {
    include: [/node_modules/],
    transformMixedEsModules: true
  }
}
```

These settings ensure:
- Proper handling of Mapbox GL JS
- Correct CommonJS/ESM module resolution
- Optimized dependency bundling

---

## Build Output

### Bundle Sizes
- **index.html**: 1.13 kB
- **CSS**: 105.90 kB (16.86 kB gzipped)
- **Main JS**: 488.29 kB (155.25 kB gzipped)
- **Mapbox GL**: 1,769.70 kB (486.89 kB gzipped)

### Performance Notes
- Mapbox GL JS is large but necessary for mapping
- Consider lazy loading the map component for faster initial load
- Gzip compression reduces sizes significantly

---

## Environment Variables for Production

### Required
```env
VITE_MAPBOX_TOKEN=your_production_token_here
```

### Optional (with defaults)
```env
VITE_APP_NAME=Dublin Property Portal
VITE_DEFAULT_MAP_CENTER_LAT=53.3498
VITE_DEFAULT_MAP_CENTER_LNG=-6.2603
VITE_DEFAULT_MAP_ZOOM=12
```

---

## Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_MAPBOX_TOKEN
```

**vercel.json** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS Amplify
1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variable: `VITE_MAPBOX_TOKEN`

### GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Note**: Update `vite.config.ts` base path:
```typescript
export default defineConfig({
  base: '/repository-name/',
  // ... rest of config
})
```

---

## Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compiles without errors
- [x] No ESLint errors
- [x] Build completes successfully
- [x] All routes work correctly

### Configuration
- [ ] Production Mapbox token configured
- [ ] Environment variables set on hosting platform
- [ ] Base URL configured (if needed)
- [ ] HTTPS enabled

### Testing
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test all property links
- [ ] Test map interactions
- [ ] Test sorting and pagination

### Performance
- [ ] Images optimized
- [ ] Lazy loading implemented (optional)
- [ ] CDN configured (optional)
- [ ] Caching headers set

### SEO (Optional)
- [ ] Update meta tags in index.html
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Configure Open Graph tags

---

## Post-Deployment

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor Mapbox API usage
- Track page load times
- Monitor bundle sizes

### Analytics (Optional)
- Google Analytics
- Plausible
- Fathom

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Map Not Loading
- Check Mapbox token is set correctly
- Verify token has correct permissions
- Check browser console for errors
- Ensure HTTPS is enabled

### Large Bundle Size
- Mapbox GL JS is ~1.7MB (normal)
- Consider code splitting:
```typescript
const PropertyMap = lazy(() => import('./components/Map/PropertyMap'));
```

### Routing Issues (404 on refresh)
- Configure redirects for SPA routing
- See platform-specific redirect rules above

---

## Optimization Recommendations

### Immediate
1. Enable gzip/brotli compression
2. Set cache headers for static assets
3. Use CDN for images

### Short-term
1. Lazy load map component
2. Implement image optimization (WebP)
3. Add service worker for offline support

### Long-term
1. Implement code splitting
2. Use dynamic imports for routes
3. Optimize Mapbox style
4. Consider Mapbox GL JS alternatives for smaller bundle

---

## Security

### Production Checklist
- [ ] Use production Mapbox token (not development)
- [ ] Restrict token to specific URLs
- [ ] Enable HTTPS only
- [ ] Set security headers
- [ ] Implement CSP (Content Security Policy)

### Mapbox Token Security
1. Go to https://account.mapbox.com/access-tokens/
2. Create production token
3. Add URL restrictions:
   - `https://yourdomain.com/*`
   - `https://www.yourdomain.com/*`
4. Set scopes (read-only for public token)

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor Mapbox API usage
- Check for security vulnerabilities
- Review error logs
- Update property data

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update (carefully)
npm update

# Test after updates
npm run build
npm run test
```

**Warning**: Do NOT update react-map-gl to v8.x until compatibility is confirmed.

---

## Rollback Plan

### If Deployment Fails
1. Revert to previous commit
2. Rebuild and redeploy
3. Check environment variables
4. Review error logs

### Version Control
```bash
# Tag releases
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Rollback if needed
git revert HEAD
git push
```

---

## Support Resources

### Documentation
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL v7](https://visgl.github.io/react-map-gl/docs/get-started)

### Community
- [Vite Discord](https://chat.vitejs.dev/)
- [Mapbox Support](https://support.mapbox.com/)
- [React Community](https://react.dev/community)

---

## Success Metrics

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### Monitoring
- Uptime: > 99.9%
- Error rate: < 0.1%
- API response time: < 500ms

---

## Contact

For deployment issues:
1. Check this document
2. Review TECHNICAL_SPECIFICATION.md
3. Check build logs
4. Verify environment variables

---

**Last Updated**: April 7, 2026  
**Build Version**: 1.0.0  
**Status**: ✅ Production Ready
