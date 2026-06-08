# Firebase CMS Setup Guide

This guide walks you through setting up Firebase CMS integration for the SPA template.

## 🚀 Quick Start

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" 
3. Enter project name (e.g., "my-spa-cms")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Required Services

In your Firebase project, enable these services:

#### Firestore Database
1. Go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location
5. Click "Create"

#### Firebase Storage (for media uploads)
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location
5. Click "Done"

#### Authentication (for admin access)
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

### 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (⚙️)
2. Under "Your apps", click the web icon (`</>`)
3. Enter app name and click "Register app"
4. Copy the `firebaseConfig` object
5. Keep this window open - you'll need these values

### 4. Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
# Enable Firebase CMS
VITE_CMS_ENABLED=true

# Firebase Configuration (from step 3)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Restart Development Server

```bash
npm run dev
# or
yarn dev
```

The template will now use Firebase CMS instead of local content!

## 📋 Firestore Database Structure

Create these collections in Firestore:

### `pages` Collection
Documents for page content:
```
pages/home_en {
  title: "Transpiled Code"
  subtitle: "Modern SPA Template"
  description: "A modern, performant single-page application template..."
  features: ["React 18", "Vite", "Emotion", "TypeScript"]
  seo: {
    title: "Transpiled Code - Modern SPA Template"
    description: "A modern, performant single-page application template..."
  }
}
```

### `settings` Collection
Site-wide configuration:
```
settings/site {
  title: "Transpiled Code"
  description: "Modern SPA Template"
  author: "Your Name"
  url: "https://yourdomain.com"
}

settings/seo {
  defaultTitle: "Transpiled Code - Modern SPA Template"
  defaultDescription: "A modern, performant single-page application template..."
  keywords: ["react", "spa", "template", "vite"]
}
```

### `navigation` Collection
Menu items:
```
navigation/main {
  id: "home"
  label: "Home"
  href: "/"
  order: 1
  menu: "main"
}

navigation/demo {
  id: "demo"
  label: "Demo"
  href: "/demo"
  order: 2
  menu: "main"
}
```

### `posts` Collection (Optional)
Blog posts/articles:
```
posts/my-first-post {
  title: "My First Post"
  slug: "my-first-post"
  content: "Lorem ipsum dolor sit amet..."
  excerpt: "A brief summary of the post..."
  published: true
  createdAt: timestamp
  updatedAt: timestamp
  order: 1
}
```

### `i18n` Collection (Optional)
Override translations:
```
i18n/en {
  "common.loading": "Loading..."
  "home.title": "Transpiled Code"
  "home.subtitle": "Modern SPA Template"
}

i18n/es {
  "common.loading": "Cargando..."
  "home.title": "Transpiled Code"
  "home.subtitle": "Plantilla SPA Moderna"
}
```

## 🔧 Advanced Configuration

### Security Rules

The template ships with a production-ready `firestore.rules` file at the repo root. It enforces:

- **Public read** on `pages`, `settings`, `navigation`, `i18n`, `posts`, `media`
- **Role-based write** — only users with a `role` custom claim (`admin`, `site_manager`, `content_manager`) can write
- **Admin-only** read/write on the `users` collection
- **Deny-all fallback** for any unlisted collection

Deploy the rules with:

```bash
yarn firebase:deploy:rules
```

> You must have the Firebase CLI installed (`npm install -g firebase-tools`) and be authenticated (`firebase login`). The `.firebaserc` file in the repo root points to your project — it is populated automatically when you run `yarn setup`.

**Do not leave Firestore in test mode in production.** Test mode allows anyone with your project ID to read and write all data.

### Restrict your Firebase API key

Firebase API keys are not secret — they are intentionally public and embedded in your client-side bundle. The protection against abuse is restricting which domains the key works from.

**Without a restriction**, anyone who copies your API key can use it from their own site to hit your Firebase Auth and Firestore quota.

**To restrict the key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com) → select your project
2. Navigate to **APIs & Services → Credentials**
3. Click the **Browser key** used for `VITE_FIREBASE_API_KEY`
4. Under **Application restrictions** select **Websites**
5. Add your production domain (e.g. `https://yourdomain.com/*`)
6. Click **Save**

This is a one-time manual step that cannot be automated — complete it before going to production.

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Usage Examples

### Using Content Hooks

```javascript
import { usePage, useSettings, useNavigation } from '@/hooks/useContent';

function Home() {
  const { content: page, loading } = usePage('home');
  const { settings } = useSettings('site');
  const { items: navItems } = useNavigation('main');
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{page?.title}</h1>
      <p>{page?.subtitle}</p>
      {/* Render navigation */}
      {navItems.map(item => (
        <a key={item.id} href={item.href}>{item.label}</a>
      ))}
    </div>
  );
}
```

### Checking CMS Status

```javascript
import { useCMS } from '@/hooks/useContent';

function AdminToggle() {
  const { isCMSEnabled, checking } = useCMS();
  
  if (checking) return <div>Checking CMS status...</div>;
  
  if (isCMSEnabled) {
    return <div>🔥 Firebase CMS is active</div>;
  }
  
  return <div>📝 Using local content</div>;
}
```

## 🚨 Troubleshooting

### Common Issues

**"Firebase CMS disabled" in console**
- Check `VITE_CMS_ENABLED=true` in `.env`
- Verify all Firebase config variables are set
- Restart development server

**"Permission denied" errors**
- Update Firestore security rules
- Ensure user is authenticated (for admin functions)

**Content not loading**
- Check Firestore collection names
- Verify document IDs match expected format
- Check browser console for specific errors

### Getting Help

1. Check the browser console for detailed error messages
2. Verify Firebase project settings and configuration
3. Ensure all environment variables are correctly set
4. Check Firestore security rules

## 🔄 Migration from Local Content

The template automatically falls back to local content when Firebase is not configured. To migrate existing local content to Firebase:

1. Set up Firebase as described above
2. Create corresponding documents in Firestore collections
3. Enable `VITE_CMS_ENABLED=true`
4. The template will automatically use Firebase content

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
