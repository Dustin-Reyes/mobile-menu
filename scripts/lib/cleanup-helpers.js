const fs = require('fs');
const path = require('path');

function isSetupComplete(dir) {
  try {
    const state = JSON.parse(
      fs.readFileSync(path.join(dir, '.template-state.json'), 'utf8'),
    );
    return state.setupComplete === true;
  } catch {
    return false;
  }
}

function getFilesToRemove(dir) {
  return [
    path.join(dir, 'src/dev/demo'),
    path.join(dir, 'src/pages/Demo.jsx'),
    path.join(dir, 'src/components/DemoWidget.jsx'),
    path.join(dir, 'src/components/ErrorTrigger.jsx'),
    path.join(dir, 'src/components/CodeBlock.jsx'),
    path.join(dir, 'scripts'),
    path.join(dir, '.template-state.json'),
  ];
}

function patchAppJsx(dir) {
  const appPath = path.join(dir, 'src/App.jsx');
  let content = fs.readFileSync(appPath, 'utf8');

  // Remove the Demo lazy import block (4 lines)
  content = content.replace(
    /\nconst Demo =\n  process\.env\.NODE_ENV !== 'production'\n    \? lazy\(\(\) => import\('pages\/Demo'\)\)\n    : null;\n/,
    '\n',
  );

  // Remove the isProduction const
  content = content.replace(
    /\n  const isProduction = process\.env\.NODE_ENV === 'production';\n/,
    '\n',
  );

  // Remove the Demo Route JSX block
  content = content.replace(
    /\n          \{!isProduction && Demo && \(\n            <Route\n              path="\/demo"\n              element=\{\n                <Suspense fallback=\{null\}>\n                  <PageTransition>\n                    <Demo \/>\n                  <\/PageTransition>\n                <\/Suspense>\n              \}\n            \/>\n          \)\}/,
    '',
  );

  fs.writeFileSync(appPath, content);
}

function patchPackageJsonCleanup(dir) {
  const pkgPath = path.join(dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.scripts) {
    delete pkg.scripts.setup;
    delete pkg.scripts.cleanup;
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function removeFiles(filePaths) {
  for (const p of filePaths) {
    try {
      fs.rmSync(p, { recursive: true, force: true });
    } catch {
      // already gone
    }
  }
}

module.exports = {
  isSetupComplete,
  getFilesToRemove,
  patchAppJsx,
  patchPackageJsonCleanup,
  removeFiles,
};
