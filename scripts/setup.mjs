import * as p from '@clack/prompts';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const writers = require('./lib/writers.js');

const PROJECT_DIR = process.cwd();

function inferProjectName() {
  return path.basename(PROJECT_DIR);
}

function inferRepoUrl() {
  try {
    return execSync('git remote get-url origin', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function isValidEmail(v) {
  return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidUrl(v) {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function cancel(msg = 'Setup cancelled.') {
  p.cancel(msg);
  process.exit(0);
}

function checkCancel(val) {
  if (p.isCancel(val)) cancel();
  return val;
}

async function collectIdentity() {
  p.log.step('Project Identity');

  const projectName = checkCancel(
    await p.text({
      message: 'Project name',
      placeholder: inferProjectName(),
      defaultValue: inferProjectName(),
    }),
  );

  const description = checkCancel(
    await p.text({
      message: 'Description',
      placeholder: 'A short description of your project',
      validate: (v) => (v ? undefined : 'Description is required'),
    }),
  );

  const version = checkCancel(
    await p.text({
      message: 'Initial version',
      placeholder: '0.1.0',
      defaultValue: '0.1.0',
    }),
  );

  const repoUrl = checkCancel(
    await p.text({
      message: 'Repository URL (optional, press Enter to skip)',
      placeholder: inferRepoUrl() || 'https://github.com/yourorg/your-project',
      defaultValue: inferRepoUrl(),
    }),
  );

  return { projectName, description, version, repoUrl };
}

async function collectUrls() {
  p.log.step('URLs');

  const productionUrl = checkCancel(
    await p.text({
      message: 'Production URL',
      placeholder: 'https://yourproject.com',
      validate: (v) => {
        if (!v) return 'Production URL is required';
        if (!isValidUrl(v)) return 'Must be a valid URL';
      },
    }),
  );

  const stagingUrl = checkCancel(
    await p.text({
      message: 'Staging URL (optional, press Enter to skip)',
      placeholder: 'https://staging.yourproject.com',
    }),
  );

  return { productionUrl, stagingUrl: stagingUrl || '' };
}

async function collectOrg() {
  p.log.step('Organization');

  const orgName = checkCancel(
    await p.text({
      message: 'Organization / company name',
      validate: (v) => (v ? undefined : 'Organization name is required'),
    }),
  );

  const email = checkCancel(
    await p.text({
      message: 'Contact email',
      validate: (v) => {
        if (!v) return 'Email is required';
        if (!isValidEmail(v)) return 'Must be a valid email address';
      },
    }),
  );

  const phone = checkCancel(
    await p.text({
      message: 'Contact phone (optional, press Enter to skip)',
      placeholder: '+15550001234',
    }),
  );

  const address = checkCancel(
    await p.text({
      message: 'Street address (optional, press Enter to skip)',
      placeholder: '123 Main St, Portland, OR 97201',
    }),
  );

  let businessHours = { days: [], open: '', close: '' };
  const addHours = checkCancel(
    await p.confirm({
      message: 'Add business hours?',
      initialValue: false,
    }),
  );

  if (addHours) {
    const daysInput = checkCancel(
      await p.text({
        message: 'Business days (comma-separated: mon,tue,wed,thu,fri)',
        placeholder: 'mon,tue,wed,thu,fri',
        defaultValue: 'mon,tue,wed,thu,fri',
      }),
    );
    const open = checkCancel(
      await p.text({
        message: 'Opening time',
        placeholder: '9:00 AM',
        defaultValue: '9:00 AM',
      }),
    );
    const close = checkCancel(
      await p.text({
        message: 'Closing time',
        placeholder: '5:00 PM',
        defaultValue: '5:00 PM',
      }),
    );
    businessHours = {
      days: daysInput.split(',').map((d) => d.trim()),
      open,
      close,
    };
  }

  return {
    orgName,
    email,
    phone: phone || '',
    address: address || '',
    businessHours,
  };
}

async function collectSocial() {
  p.log.step('Social Links (all optional — press Enter to skip)');

  const twitter = checkCancel(
    await p.text({
      message: 'Twitter URL',
      placeholder: 'https://twitter.com/yourhandle',
    }),
  );
  const github = checkCancel(
    await p.text({
      message: 'GitHub URL',
      placeholder: 'https://github.com/yourorg',
    }),
  );
  const linkedin = checkCancel(
    await p.text({
      message: 'LinkedIn URL',
      placeholder: 'https://linkedin.com/company/yourco',
    }),
  );
  const facebook = checkCancel(
    await p.text({ message: 'Facebook URL', placeholder: '' }),
  );
  const instagram = checkCancel(
    await p.text({ message: 'Instagram URL', placeholder: '' }),
  );

  return {
    twitter: twitter || '',
    github: github || '',
    linkedin: linkedin || '',
    facebook: facebook || '',
    instagram: instagram || '',
  };
}

async function collectAnalytics() {
  p.log.step('Analytics & Monitoring (all optional — press Enter to skip)');

  const sentryDsn = checkCancel(
    await p.text({
      message: 'Sentry DSN',
      placeholder: 'https://...@sentry.io/...',
    }),
  );
  const gaId = checkCancel(
    await p.text({
      message: 'Google Analytics ID',
      placeholder: 'G-XXXXXXXXXX',
    }),
  );
  const gtmId = checkCancel(
    await p.text({
      message: 'Google Tag Manager ID',
      placeholder: 'GTM-XXXXXXX',
    }),
  );
  const hotjarId = checkCancel(
    await p.text({ message: 'Hotjar ID', placeholder: '' }),
  );

  return {
    sentryDsn: sentryDsn || '',
    gaId: gaId || '',
    gtmId: gtmId || '',
    hotjarId: hotjarId || '',
  };
}

async function collectFirebase() {
  p.log.step('Firebase (optional — press Enter on any field to skip)');

  const configure = checkCancel(
    await p.confirm({
      message: 'Configure Firebase now?',
      initialValue: false,
    }),
  );

  if (!configure) {
    return {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
    };
  }

  const firebaseApiKey = checkCancel(
    await p.text({ message: 'Firebase API Key', placeholder: 'AIzaSy...' }),
  );
  const firebaseAuthDomain = checkCancel(
    await p.text({
      message: 'Firebase Auth Domain',
      placeholder: 'your-app.firebaseapp.com',
    }),
  );
  const firebaseProjectId = checkCancel(
    await p.text({
      message: 'Firebase Project ID',
      placeholder: 'your-app-prod',
    }),
  );
  const firebaseStorageBucket = checkCancel(
    await p.text({
      message: 'Firebase Storage Bucket',
      placeholder: 'your-app.appspot.com',
    }),
  );
  const firebaseMessagingSenderId = checkCancel(
    await p.text({ message: 'Messaging Sender ID', placeholder: '' }),
  );
  const firebaseAppId = checkCancel(
    await p.text({ message: 'App ID', placeholder: '1:...' }),
  );

  return {
    firebaseApiKey: firebaseApiKey || '',
    firebaseAuthDomain: firebaseAuthDomain || '',
    firebaseProjectId: firebaseProjectId || '',
    firebaseStorageBucket: firebaseStorageBucket || '',
    firebaseMessagingSenderId: firebaseMessagingSenderId || '',
    firebaseAppId: firebaseAppId || '',
  };
}

async function collectLanguages() {
  p.log.step('Languages');

  const addMore = checkCancel(
    await p.confirm({
      message: 'English + Spanish are included by default. Add more languages?',
      initialValue: false,
    }),
  );

  let languages = ['en', 'es'];

  if (addMore) {
    const extra = checkCancel(
      await p.text({
        message: 'Additional language codes (comma-separated, e.g. fr,de,pt)',
        placeholder: 'fr,de',
      }),
    );
    if (extra) {
      languages = [
        ...languages,
        ...extra
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
      ];
    }
  }

  return { languages };
}

function buildSummary(values) {
  const lines = [
    `Project:     ${values.projectName} (${values.version})`,
    `Description: ${values.description}`,
    `Domain:      ${values.productionUrl}`,
    values.stagingUrl ? `Staging:     ${values.stagingUrl}` : null,
    `Org:         ${values.orgName}`,
    `Email:       ${values.email}`,
    values.phone ? `Phone:       ${values.phone}` : null,
    values.address ? `Address:     ${values.address}` : null,
    values.repoUrl ? `Repo:        ${values.repoUrl}` : null,
    `Languages:   ${values.languages.join(', ')}`,
    values.sentryDsn ? `Sentry:      configured` : null,
    values.gaId ? `GA ID:       ${values.gaId}` : null,
    values.firebaseProjectId
      ? `Firebase:    ${values.firebaseProjectId}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');
  return lines;
}

async function main() {
  p.intro('  transpiled-web-template setup  ');

  const identity = await collectIdentity();
  const urls = await collectUrls();
  const org = await collectOrg();
  const social = await collectSocial();
  const analytics = await collectAnalytics();
  const firebase = await collectFirebase();
  const langs = await collectLanguages();

  const values = {
    ...identity,
    ...urls,
    ...org,
    ...social,
    ...analytics,
    ...firebase,
    ...langs,
  };

  p.note(buildSummary(values), 'Summary — about to write these values');

  const confirmed = checkCancel(
    await p.confirm({ message: 'Write these values to the project?' }),
  );
  if (!confirmed) cancel('No changes written.');

  const s = p.spinner();
  s.start('Writing configuration files...');

  try {
    writers.writeProjectConfig(PROJECT_DIR, values);
    writers.writePackageJson(PROJECT_DIR, values);
    writers.writeEnvExample(PROJECT_DIR, values);
    writers.writeManifest(PROJECT_DIR, values);
    writers.writeRobotsTxt(PROJECT_DIR, values);
    writers.writeContentSettings(PROJECT_DIR, values);
    writers.writeTemplateState(PROJECT_DIR);
    s.stop('Configuration files written.');
  } catch (err) {
    s.stop('Failed to write files.');
    p.log.error(err.message);
    process.exit(1);
  }

  const doCommit = checkCancel(
    await p.confirm({
      message: 'Create initial git commit?',
      initialValue: true,
    }),
  );

  if (doCommit) {
    try {
      execSync('git add -A', { cwd: PROJECT_DIR, stdio: 'inherit' });
      execSync(
        `git commit -m "chore: initialize ${values.projectName} from transpiled-web-template"`,
        {
          cwd: PROJECT_DIR,
          stdio: 'inherit',
        },
      );
      p.log.success('Initial commit created.');
    } catch (err) {
      p.log.warn('Could not create commit — you can commit manually.');
    }
  }

  const doCleanup = checkCancel(
    await p.confirm({
      message:
        'Remove template scaffolding now? (you can always run `yarn cleanup` later)',
      initialValue: false,
    }),
  );

  if (doCleanup) {
    const { default: runCleanup } = await import('./cleanup.mjs');
    await runCleanup({ skipIntro: true });
  } else {
    p.outro(
      `Setup complete! Next: yarn dev   •   yarn cleanup when ready to remove template scaffolding`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
