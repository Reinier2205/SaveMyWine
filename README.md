# SaveMyWines 🍷

A modern web application for building and managing your personal wine collection. Scan wine labels, organize your collection, and never forget a great bottle again.

## Features

- **📱 Mobile-First Design** - Optimized for mobile devices with a clean, intuitive interface
- **📷 Wine Label Scanning** - Use your phone's camera to scan wine labels and automatically add them to your collection
- **✏️ Manual Entry** - Prefer to type? Add wines manually with our simple form
- **🔍 Smart Search & Filtering** - Quickly find wines in your collection with powerful search and filtering options
- **🏷️ Organization** - Sort and filter wines by varietal, region, vintage, and more
- **📝 Personal Notes** - Add tasting notes, ratings, and memories to each wine
- **💾 Local Storage** - Your wine data stays on your device for privacy and offline access
- **📱 PWA Support** - Install as a native app on your device
- **🌐 Offline Capable** - Works even when you're offline

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera access for scanning functionality (mobile devices recommended)
- Local storage enabled

### Installation

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start building** your wine collection!

### PWA Installation

1. Open the app in a supported browser
2. Look for the install prompt or use the browser's menu
3. Click "Install" to add to your home screen
4. Enjoy the app-like experience!

## Usage

### Adding Wines

#### Option 1: Scan Wine Label
1. Navigate to the **Scan** page
2. Tap "Start Camera" to activate your device's camera
3. Point the camera at a wine label
4. The app will attempt to detect and extract wine information
5. Review and edit the detected information if needed
6. Tap "Add Wine" to save to your collection

#### Option 2: Manual Entry
1. Navigate to the **Scan** page
2. Scroll down to the "Or Enter Manually" section
3. Fill in the wine details:
   - Wine Name
   - Varietal
   - Region
   - Vintage
4. Tap "Add Wine" to save to your collection

### Managing Your Collection

#### Viewing Wines
- Navigate to the **My Wines** page to see all your wines
- Use the search bar to find specific wines
- Apply filters by varietal, region, or other criteria

#### Editing Wines
1. Find the wine you want to edit in your collection
2. Tap the "Edit" button
3. Make your changes
4. Tap "Save Changes"

#### Deleting Wines
1. Find the wine you want to delete
2. Tap the "Delete" button
3. Confirm the deletion

### Features

#### Search & Filtering
- **Text Search**: Search by wine name, varietal, region, or vintage
- **Varietal Filter**: Filter by specific grape varieties
- **Region Filter**: Filter by wine regions
- **Vintage Filter**: Filter by specific years or year ranges

#### Organization
- Wines are automatically categorized by type (Red, White, Other)
- Sort by various criteria
- Group wines by your preferences

#### Privacy & Security
- All data is stored locally on your device
- No personal information is sent to external servers
- Your wine collection remains private

## Technical Details

### Architecture

The application is built using:
- **HTML5** for structure
- **CSS3** with custom properties for styling
- **Vanilla JavaScript** for functionality
- **Progressive Web App (PWA)** features
- **Service Worker** for offline functionality
- **Local Storage** for data persistence

### File Structure

```
SaveMyWines/
├── index.html          # Home page
├── scan.html          # Wine scanning page
├── wines.html         # Wine collection page
├── about.html         # About page
├── style/
│   └── styledemo.css  # Main stylesheet
├── scripts/
│   ├── main.js        # Common functionality
│   ├── scan.js        # Scanning functionality
│   ├── wines.js       # Collection management
│   ├── ui.js          # UI components
│   ├── api.js         # API handling
│   ├── storage.js     # Data storage
│   └── utils.js       # Utility functions
├── manifest.webmanifest # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
```

### Browser Support

- **Chrome** 60+ (Full support)
- **Firefox** 55+ (Full support)
- **Safari** 11.1+ (Full support)
- **Edge** 79+ (Full support)
- **Mobile browsers** (iOS Safari, Chrome Mobile, etc.)

### PWA Features

- **Installable** - Add to home screen
- **Offline capable** - Works without internet
- **Responsive** - Adapts to any screen size
- **Fast** - Optimized performance
- **Secure** - HTTPS recommended

## Customization

### Styling

The app uses CSS custom properties for easy theming. Main colors and variables are defined in `style/styledemo.css`:

```css
:root {
  --color-primary: #5B0E2D;      /* Primary brand color */
  --color-secondary: #F4C2C2;    /* Secondary color */
  --color-accent: #C9A646;       /* Accent color */
  --color-bg: #F8F4F0;           /* Background color */
  --color-text: #2B2B2B;         /* Text color */
}
```

### Adding New Features

The modular JavaScript architecture makes it easy to add new functionality:

1. **Create** new JavaScript files in the `scripts/` directory
2. **Import** them in the appropriate HTML files
3. **Extend** the global `SaveMyWines` object with new functionality

## Troubleshooting

### Common Issues

#### Camera Not Working
- Ensure camera permissions are granted
- Try refreshing the page
- Check if your device supports camera access

#### Data Not Saving
- Verify local storage is enabled in your browser
- Check browser console for error messages
- Try clearing browser cache and data

#### App Not Loading
- Check internet connection
- Clear browser cache
- Try a different browser

#### Offline Functionality Issues
- Ensure the service worker is registered
- Check browser console for service worker errors
- Verify PWA installation

### Browser Console

Open your browser's developer tools (F12) to see:
- JavaScript errors
- Service worker status
- Storage information
- Network requests

## Contributing

### Development Setup

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Comment complex functions
- Use meaningful variable names
- Test across different browsers

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure your browser is up to date
- Try the app in a different browser

## Roadmap

### Future Features

- **Cloud Sync** - Backup and sync across devices
- **Wine Recommendations** - AI-powered wine suggestions
- **Social Features** - Share collections with friends
- **Advanced Analytics** - Track your wine preferences
- **Barcode Scanning** - Scan wine barcodes for quick entry
- **Export Options** - CSV, PDF, and other formats
- **Wine Education** - Learn about varietals and regions
- **Food Pairing** - Get food pairing suggestions

### Performance Improvements

- **Lazy Loading** - Load images and data on demand
- **Image Optimization** - Compress and optimize wine label images
- **Caching Strategies** - Improved offline performance
- **Bundle Optimization** - Reduce JavaScript bundle size

---

**SaveMyWines** - Your personal wine collection, simplified. 🍷✨
