import * as p from '@clack/prompts';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const helpers = require('./lib/cleanup-helpers.js');

const PROJECT_DIR = process.cwd();

function cancel(msg = 'Cleanup cancelled. No changes made.') {
  p.cancel(msg);
  process.exit(0);
}

function checkCancel(val) {
  if (p.isCancel(val)) cancel();
  return val;
}

export default async function runCleanup({ skipIntro = false } = {}) {
  if (!skipIntro) {
    p.intro('  transpiled-web-template cleanup  ');
  }

  // Guard: warn if setup was never run
  if (!helpers.isSetupComplete(PROJECT_DIR)) {
    const proceed = checkCancel(
      await p.confirm({
        message:
          'Setup has not been run yet. Remove template scaffolding anyway?',
        initialValue: false,
      }),
    );
    if (!proceed) cancel();
  }

  const files = helpers.getFilesToRemove(PROJECT_DIR);

  p.note(
    [
      'The following will be permanently removed:',
      '',
      '  src/dev/demo/           — component showcase',
      '  src/pages/Demo.jsx      — demo route page',
      '  src/components/DemoWidget.jsx',
      '  src/components/ErrorTrigger.jsx',
      '  src/components/CodeBlock.jsx',
      '  scripts/                — setup + cleanup scripts',
      '  .template-state.json',
      '',
      'App.jsx will be patched to remove the /demo route.',
      'package.json will be patched to remove setup/cleanup scripts.',
    ].join('\n'),
    'What will be removed',
  );

  const confirmed = checkCancel(
    await p.confirm({
      message: 'This is irreversible. Proceed?',
      initialValue: false,
    }),
  );
  if (!confirmed) cancel();

  const s = p.spinner();

  s.start('Patching App.jsx...');
  try {
    helpers.patchAppJsx(PROJECT_DIR);
    s.stop('App.jsx patched.');
  } catch (err) {
    s.stop('Failed to patch App.jsx.');
    p.log.error(err.message);
    process.exit(1);
  }

  s.start('Patching package.json...');
  try {
    helpers.patchPackageJsonCleanup(PROJECT_DIR);
    s.stop('package.json patched.');
  } catch (err) {
    s.stop('Failed to patch package.json.');
    p.log.error(err.message);
    process.exit(1);
  }

  s.start('Removing template files...');
  try {
    helpers.removeFiles(files);
    s.stop('Template files removed.');
  } catch (err) {
    s.stop('Failed to remove some files.');
    p.log.warn(err.message);
  }

  s.start('Running yarn format && yarn lint --fix...');
  try {
    execSync('yarn format && yarn lint --fix', {
      cwd: PROJECT_DIR,
      stdio: 'pipe',
    });
    s.stop('Code formatted and linted.');
  } catch {
    s.stop('Format/lint completed with warnings — review manually if needed.');
  }

  const doCommit = checkCancel(
    await p.confirm({
      message: 'Commit cleanup?',
      initialValue: true,
    }),
  );

  if (doCommit) {
    try {
      execSync('git add -A', { cwd: PROJECT_DIR, stdio: 'inherit' });
      execSync('git commit -m "chore: remove template scaffolding"', {
        cwd: PROJECT_DIR,
        stdio: 'inherit',
      });
      p.log.success('Cleanup committed.');
    } catch {
      p.log.warn('Could not create commit — you can commit manually.');
    }
  }

  p.outro('Template scaffolding removed. Your project is ready.');
}

// Run directly when invoked via yarn cleanup (not when imported by setup.mjs)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCleanup().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
