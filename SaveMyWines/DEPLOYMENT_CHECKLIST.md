# 📋 SaveMyWines Deployment Checklist

Use this checklist to ensure all deployment steps are completed correctly.

## 🔧 Edge Functions Deployment

### Prerequisites
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Logged in to Supabase: `supabase login`
- [ ] Google Cloud Vision API key obtained
- [ ] Supabase Service Role Key copied from dashboard

### Deployment Steps
- [ ] Link to project: `supabase link --project-ref ssgraiwyiknqtlhjxvpc`
- [ ] Deploy scan_wine function: `supabase functions deploy scan_wine`
- [ ] Deploy add_wine function: `supabase functions deploy add_wine`
- [ ] Deploy list_wines function: `supabase functions deploy list_wines`

### Environment Variables
- [ ] Set VISION_API_KEY in Supabase dashboard
- [ ] Set SUPABASE_SERVICE_ROLE_KEY in Supabase dashboard
- [ ] Verify environment variables are active

### Testing Edge Functions
- [ ] Test scan_wine with OPTIONS request
- [ ] Test add_wine with POST request
- [ ] Test list_wines with GET request
- [ ] Check function logs in Supabase dashboard

## 🌐 Frontend Deployment

### Prerequisites
- [ ] Choose hosting platform (Cloudflare Pages or Netlify)
- [ ] Account created on chosen platform
- [ ] CLI tools installed (Wrangler or Netlify CLI)

### Cloudflare Pages Deployment
- [ ] Install Wrangler: `npm install -g wrangler`
- [ ] Login to Cloudflare: `wrangler login`
- [ ] Deploy: `wrangler pages deploy SaveMyWines --project-name savemywines`
- [ ] Note the deployment URL

### Netlify Deployment
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login to Netlify: `netlify login`
- [ ] Deploy: `netlify deploy --prod --dir=SaveMyWines`
- [ ] Note the deployment URL

### Configuration Updates
- [ ] Update CONFIG URLs in scripts/api.js if needed
- [ ] Verify all Edge Function URLs are correct
- [ ] Test configuration with checkEdgeFunctions() utility

## ✅ Production Testing

### Functionality Tests
- [ ] Visit deployed frontend
- [ ] Test wine scanning workflow end-to-end
- [ ] Verify wine saving to database
- [ ] Test wine listing and filtering
- [ ] Test export/import functionality
- [ ] Verify "Soon" badge appears correctly

### PWA Testing
- [ ] Check manifest.webmanifest is accessible
- [ ] Verify service worker registration
- [ ] Test PWA installation on mobile device
- [ ] Verify offline functionality (if implemented)

### Performance Tests
- [ ] Check Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- [ ] Verify cold start times for Edge Functions
- [ ] Test on different devices and browsers
- [ ] Check mobile responsiveness

## 🔒 Security & Privacy Verification

### Data Segregation
- [ ] Verify device_id-based data separation works
- [ ] Test that users can only see their own wines
- [ ] Confirm RLS policies are working correctly

### API Security
- [ ] Verify Edge Functions require proper parameters
- [ ] Test error handling for malformed requests
- [ ] Confirm no sensitive data is exposed in responses

## 📱 User Experience Verification

### Accessibility
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check focus indicators are visible
- [ ] Test with high contrast mode

### Mobile Experience
- [ ] Test camera capture functionality
- [ ] Verify touch interactions work properly
- [ ] Check PWA installation prompts
- [ ] Test responsive design on various screen sizes

## 🚨 Post-Deployment Monitoring

### Error Monitoring
- [ ] Set up error logging for Edge Functions
- [ ] Monitor function execution times
- [ ] Track API usage and limits
- [ ] Set up alerts for function failures

### User Analytics
- [ ] Track wine scanning success rates
- [ ] Monitor user engagement metrics
- [ ] Track PWA installation rates
- [ ] Monitor performance metrics

## 🔄 Maintenance Tasks

### Regular Updates
- [ ] Monitor Supabase Edge Function logs
- [ ] Check for Google Vision API quota usage
- [ ] Review and update dependencies
- [ ] Monitor hosting platform performance

### Backup & Recovery
- [ ] Document deployment process
- [ ] Create rollback procedures
- [ ] Set up automated backups
- [ ] Test recovery procedures

## 📚 Documentation

### User Documentation
- [ ] Update README with deployment information
- [ ] Document environment variable requirements
- [ ] Create troubleshooting guide
- [ ] Document API endpoints

### Developer Documentation
- [ ] Update deployment scripts
- [ ] Document configuration options
- [ ] Create maintenance procedures
- [ ] Document testing procedures

## 🎯 Final Verification

### Production Readiness
- [ ] All functionality works as expected
- [ ] Performance meets requirements
- [ ] Security measures are in place
- [ ] Monitoring and alerting configured
- [ ] Documentation is complete
- [ ] Team is trained on deployment process

---

**Status**: ⏳ In Progress  
**Last Updated**: [Date]  
**Next Review**: [Date + 1 week]
