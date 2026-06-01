const fs = require('fs');
const os = require('os');
const path = require('path');

let writers;
const TEST_VALUES = {
  projectName: 'my-app',
  description: 'A great app',
  version: '0.1.0',
  productionUrl: 'https://myapp.com',
  stagingUrl: 'https://staging.myapp.com',
  repoUrl: 'https://github.com/myorg/my-app',
  orgName: 'My Company',
  email: 'info@myapp.com',
  phone: '+15550001234',
  address: '123 Main St, Portland, OR 97201',
  businessHours: {
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    open: '9:00 AM',
    close: '5:00 PM',
  },
  twitter: 'https://twitter.com/myapp',
  github: 'https://github.com/myorg',
  linkedin: '',
  facebook: '',
  instagram: '',
  sentryDsn: 'https://abc@sentry.io/123',
  gaId: 'G-ABC123',
  gtmId: '',
  hotjarId: '',
  firebaseApiKey: 'AIza123',
  firebaseAuthDomain: 'myapp.firebaseapp.com',
  firebaseProjectId: 'myapp-prod',
  firebaseStorageBucket: 'myapp.appspot.com',
  firebaseMessagingSenderId: '999',
  firebaseAppId: '1:999:web:abc',
  languages: ['en', 'es'],
};

let tmpDir;

beforeEach(() => {
  writers = require('../../scripts/lib/writers');
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-writers-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  jest.resetModules();
});

describe('writeProjectConfig', () => {
  it('writes src/config/project.js with provided values', () => {
    writers.writeProjectConfig(tmpDir, TEST_VALUES);
    const content = fs.readFileSync(
      path.join(tmpDir, 'src/config/project.js'),
      'utf8',
    );
    expect(content).toContain("name: 'my-app'");
    expect(content).toContain("'https://myapp.com'");
    expect(content).toContain('My Company');
    expect(content).toContain('info@myapp.com');
    expect(content).toContain('+15550001234');
    expect(content).toContain('export default PROJECT_CONFIG');
  });

  it('handles empty optional fields gracefully', () => {
    const minimal = {
      ...TEST_VALUES,
      phone: '',
      address: '',
      stagingUrl: '',
      twitter: '',
      github: '',
    };
    writers.writeProjectConfig(tmpDir, minimal);
    const content = fs.readFileSync(
      path.join(tmpDir, 'src/config/project.js'),
      'utf8',
    );
    expect(content).toContain("name: 'my-app'");
  });
});

describe('writePackageJson', () => {
  it('updates name, description, version, and repository in package.json', () => {
    const pkgPath = path.join(tmpDir, 'package.json');
    fs.writeFileSync(
      pkgPath,
      JSON.stringify(
        {
          name: 'transpiled-web-template',
          version: '0.0.1',
          description: '',
          repository: '',
          scripts: { dev: 'vite' },
        },
        null,
        2,
      ),
    );

    writers.writePackageJson(tmpDir, TEST_VALUES);

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.name).toBe('my-app');
    expect(pkg.description).toBe('A great app');
    expect(pkg.repository).toBe('https://github.com/myorg/my-app');
    expect(pkg.version).toBe('0.1.0');
    expect(pkg.scripts).toBeDefined();
  });
});

describe('writeEnvExample', () => {
  it('writes .env.example with user values as comments', () => {
    writers.writeEnvExample(tmpDir, TEST_VALUES);
    const content = fs.readFileSync(path.join(tmpDir, '.env.example'), 'utf8');
    expect(content).toContain('VITE_SENTRY_DSN=');
    expect(content).toContain('VITE_FIREBASE_API_KEY=');
    expect(content).toContain('VITE_CMS_ENABLED=false');
    expect(content).toContain('# https://abc@sentry.io/123');
    expect(content).toContain('# AIza123');
  });

  it('omits comment hints when optional values are empty', () => {
    const noOptional = { ...TEST_VALUES, sentryDsn: '', firebaseApiKey: '' };
    writers.writeEnvExample(tmpDir, noOptional);
    const content = fs.readFileSync(path.join(tmpDir, '.env.example'), 'utf8');
    expect(content).toContain('VITE_SENTRY_DSN=');
    expect(content).not.toContain('# https://');
  });
});

describe('writeManifest', () => {
  it('writes public/manifest.json with project name', () => {
    writers.writeManifest(tmpDir, TEST_VALUES);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(tmpDir, 'public/manifest.json'), 'utf8'),
    );
    expect(manifest.name).toBe('My Company');
    expect(manifest.short_name).toBe('my-app');
    expect(manifest.start_url).toBe('/');
  });
});

describe('writeRobotsTxt', () => {
  it('writes public/robots.txt with production sitemap URL', () => {
    writers.writeRobotsTxt(tmpDir, TEST_VALUES);
    const content = fs.readFileSync(
      path.join(tmpDir, 'public/robots.txt'),
      'utf8',
    );
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('https://myapp.com/sitemap.xml');
  });
});

describe('writeContentSettings', () => {
  it('writes src/content/settings.js with project values', () => {
    writers.writeContentSettings(tmpDir, TEST_VALUES);
    const content = fs.readFileSync(
      path.join(tmpDir, 'src/content/settings.js'),
      'utf8',
    );
    expect(content).toContain('my-app');
    expect(content).toContain('https://myapp.com');
    expect(content).toContain('My Company');
  });
});

describe('writeTemplateState', () => {
  it('writes .template-state.json with setupComplete: true', () => {
    writers.writeTemplateState(tmpDir);
    const state = JSON.parse(
      fs.readFileSync(path.join(tmpDir, '.template-state.json'), 'utf8'),
    );
    expect(state.setupComplete).toBe(true);
    expect(typeof state.setupAt).toBe('string');
    expect(state.templateVersion).toBe('transpiled-web-template');
  });
});
