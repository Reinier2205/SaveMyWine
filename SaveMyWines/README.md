# SaveMyWines 🍷

A modern Progressive Web App (PWA) for building and managing your personal wine collection. Scan wine labels, organize your collection, and never forget a great bottle again.

## Features

- **📱 PWA Support** - Install as a native app on your device
- **🌐 Offline Capable** - Works even when you're offline
- **📷 Wine Label Scanning** - Use your phone's camera to scan wine labels
- **✏️ Manual Entry** - Add wines manually with our simple form
- **🔍 Smart Search & Filtering** - Find wines quickly with powerful search
- **🏷️ Organization** - Sort and filter wines by varietal, region, vintage
- **📝 Personal Notes** - Add tasting notes, ratings, and memories
- **💾 Local Storage** - Your data stays on your device for privacy

## PWA Features

### Manifest
- **App Name**: SaveMyWines
- **Short Name**: Wines
- **Display Mode**: Standalone (app-like experience)
- **Theme Color**: #5B0E2D (wine red)
- **Background Color**: #F8F4F0 (cream)
- **Start URL**: /index.html

### Service Worker
- **Caching Strategy**: 
  - Cache-first for static assets (CSS, JS, fonts)
  - Network-first for pages
- **Offline Support**: App shell cached for offline access
- **Background Sync**: Ready for future offline data sync

### Installation
- **Browser Support**: Chrome, Edge, Safari, Firefox
- **Install Prompt**: Appears automatically in supported browsers
- **Home Screen**: Add to home screen for quick access

## Getting Started

### Prerequisites
- Modern web browser with PWA support
- HTTPS connection (required for service worker)
- Camera access for wine scanning

### Installation
1. Visit the app in a supported browser
2. Look for the install prompt (browser dependent)
3. Click "Install" to add to home screen
4. App will work offline after first visit

### Development Setup
1. Clone the repository
2. Serve files from a web server (required for service worker)
3. Open in browser and test PWA functionality

## File Structure

```
SaveMyWines/
├── index.html          # Main landing page
├── scan.html          # Wine scanning page
├── wines.html         # Wine collection page
├── about.html         # About page
├── manifest.webmanifest # PWA manifest
├── sw.js             # Service worker
├── style/
│   └── styledemo.css # Main stylesheet
├── scripts/
│   ├── main.js       # Common functionality
│   ├── scan.js       # Camera and scanning
│   ├── wines.js      # Collection management
│   ├── ui.js         # UI components
│   ├── api.js        # API integration
│   ├── storage.js    # Local storage
│   └── utils.js      # Utility functions
└── icons/            # App icons
    ├── icon-192.png  # 192x192 icon
    └── icon-512.png  # 512x512 icon
```

## PWA Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check Manifest and Service Worker sections
4. Test offline functionality

### Lighthouse Audit
1. Run Lighthouse audit
2. Check PWA score
3. Verify installability and offline support

### Browser Testing
- **Chrome**: Full PWA support
- **Edge**: Full PWA support
- **Safari**: Basic PWA support
- **Firefox**: Basic PWA support

## Offline Functionality

### Cached Resources
- HTML pages
- CSS stylesheets
- JavaScript files
- App shell components

### Offline Features
- View cached pages
- Access wine collection
- Use app navigation
- View cached content

### Online Features
- Wine label scanning
- API data fetching
- Real-time updates
- Data synchronization

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Manifest | ✅ | ✅ | ✅ | ✅ |
| Install Prompt | ✅ | ✅ | ✅ | ✅ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |
| Background Sync | ✅ | ✅ | ❌ | ❌ |

## Future Enhancements

- **Push Notifications** - Wine recommendations and reminders
- **Background Sync** - Offline data synchronization
- **Advanced Caching** - Image and media caching
- **Web Share API** - Share wines with friends
- **Geolocation** - Wine shop locations

## Troubleshooting

### Service Worker Issues
- Clear browser cache and storage
- Check HTTPS requirement
- Verify file paths in sw.js

### Installation Problems
- Ensure browser supports PWA
- Check manifest validity
- Verify icon files exist

### Offline Issues
- Check service worker registration
- Verify cached resources
- Test in incognito mode

## Contributing

1. Fork the repository
2. Create feature branch
3. Test PWA functionality
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For PWA-specific issues:
- Check browser compatibility
- Verify HTTPS setup
- Test service worker registration
- Use browser DevTools for debugging
