const fs = require('fs');
const path = require('path');

function fixPackageExports(pkgPath) {
  if (!fs.existsSync(pkgPath)) {
    console.log(`Not found: ${pkgPath}`);
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let modified = false;
    
    if (pkg.exports) {
      for (const key of Object.keys(pkg.exports)) {
        const conditions = pkg.exports[key];
        if (typeof conditions === 'object' && !Array.isArray(conditions) && conditions !== null) {
          if ('default' in conditions) {
            // Re-order so 'default' is last
            const newConditions = {};
            for (const cond in conditions) {
              if (cond !== 'default') {
                newConditions[cond] = conditions[cond];
              }
            }
            newConditions['default'] = conditions['default'];
            pkg.exports[key] = newConditions;
            modified = true;
          }
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log(`Fixed Webpack 'default' condition export order in ${pkgPath}`);
    }
  } catch (err) {
    console.error(`Error processing ${pkgPath}:`, err);
  }
}

// Fix the packages
const base = path.join(__dirname, 'node_modules', '@midnight-ntwrk');
if (fs.existsSync(base)) {
  const packages = fs.readdirSync(base);
  for (const pkg of packages) {
    fixPackageExports(path.join(base, pkg, 'package.json'));
  }
}

// Also check lumina-circuits node_modules just in case (since monorepos hoist differently)
const circuitsBase = path.join(__dirname, 'node_modules', 'lumina-circuits', 'node_modules', '@midnight-ntwrk');
if (fs.existsSync(circuitsBase)) {
  const packages = fs.readdirSync(circuitsBase);
  for (const pkg of packages) {
    fixPackageExports(path.join(circuitsBase, pkg, 'package.json'));
  }
}

console.log("Midnight Webpack Patch Complete");
