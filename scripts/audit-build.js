#!/usr/bin/env node

/**
 * Production Build Audit Script
 * Analyzes the production build for unnecessary files and optimization opportunities
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let totalSize = 0;

  function calculateSize(filePath) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(filePath);
      files.forEach((file) => {
        calculateSize(path.join(filePath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }

  calculateSize(dirPath);
  return totalSize;
}

function auditBuild() {
  const distPath = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distPath)) {
    colorLog('❌ No dist folder found. Run `yarn build` first.', 'red');
    process.exit(1);
  }

  colorLog('🔍 Production Build Audit', 'bright');
  colorLog('==========================', 'cyan');

  // Check total size
  const totalSize = getDirectorySize(distPath);
  colorLog(`\n📊 Total Bundle Size: ${formatBytes(totalSize)}`, 'blue');

  // Check for source maps
  colorLog('\n🗺️  Source Maps:', 'yellow');
  const jsPath = path.join(distPath, 'assets/js');
  let sourceMaps = [];

  if (fs.existsSync(jsPath)) {
    const jsFiles = fs.readdirSync(jsPath);
    sourceMaps = jsFiles.filter((file) => file.endsWith('.map'));

    if (sourceMaps.length > 0) {
      colorLog(
        `❌ Found ${sourceMaps.length} source map files in production build`,
        'red',
      );
      sourceMaps.forEach((map) => colorLog(`   - ${map}`, 'red'));
    } else {
      colorLog('✅ No source maps found in production build', 'green');
    }
  }

  // Check essential SEO files
  colorLog('\n🔍 SEO Files:', 'yellow');
  const seoFiles = ['sitemap.xml', 'robots.txt', 'manifest.json'];
  seoFiles.forEach((file) => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      colorLog(`✅ ${file} (${formatBytes(size)})`, 'green');
    } else {
      colorLog(`❌ Missing ${file}`, 'red');
    }
  });

  // Check for development files
  colorLog('\n🚫 Development Files Check:', 'yellow');
  const devPatterns = ['.test.', '.spec.', '__mocks__', '.config.js'];
  let foundDevFiles = [];

  function checkForDevFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        checkForDevFiles(filePath);
      } else {
        if (devPatterns.some((pattern) => file.includes(pattern))) {
          foundDevFiles.push(path.relative(distPath, filePath));
        }
      }
    });
  }

  checkForDevFiles(distPath);

  if (foundDevFiles.length > 0) {
    colorLog(
      `❌ Found ${foundDevFiles.length} development files in production build:`,
      'red',
    );
    foundDevFiles.forEach((file) => colorLog(`   - ${file}`, 'red'));
  } else {
    colorLog('✅ No development files found in production build', 'green');
  }

  // Asset breakdown
  colorLog('\n📦 Asset Breakdown:', 'yellow');
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assetDirs = fs.readdirSync(assetsPath);
    assetDirs.forEach((dir) => {
      const dirPath = path.join(assetsPath, dir);
      if (fs.statSync(dirPath).isDirectory()) {
        const size = getDirectorySize(dirPath);
        colorLog(`   ${dir}/: ${formatBytes(size)}`, 'blue');
      }
    });
  }

  // JavaScript bundle analysis
  colorLog('\n⚡ JavaScript Bundles:', 'yellow');
  if (fs.existsSync(jsPath)) {
    const jsFiles = fs
      .readdirSync(jsPath)
      .filter((file) => file.endsWith('.js'));
    jsFiles.forEach((file) => {
      const filePath = path.join(jsPath, file);
      const size = fs.statSync(filePath).size;
      colorLog(`   ${file}: ${formatBytes(size)}`, 'blue');
    });
  }

  // Recommendations
  colorLog('\n💡 Recommendations:', 'yellow');

  if (totalSize > 2 * 1024 * 1024) {
    // > 2MB
    colorLog('⚠️  Bundle size is large. Consider:', 'yellow');
    colorLog('   - Code splitting', 'blue');
    colorLog('   - Image optimization', 'blue');
    colorLog('   - Font subsetting', 'blue');
  } else if (totalSize < 1024 * 1024) {
    // < 1MB
    colorLog('✅ Bundle size is optimal!', 'green');
  } else {
    colorLog('✅ Bundle size is acceptable', 'green');
  }

  if (foundDevFiles.length === 0 && !sourceMaps.length) {
    colorLog('✅ Production build is well optimized!', 'green');
  }

  colorLog('\n🎯 Build Audit Complete!', 'bright');
}

// Run the audit
if (require.main === module) {
  auditBuild();
}

module.exports = { auditBuild };
