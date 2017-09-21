var path = require('path');
var glob = require('glob').sync;
var fs = require('fs-extra');
var pug = require('pug');

// generate the tutorials
fs.ensureDirSync('dist/tutorials');
var tutorials = glob('tutorials/*/tutorial.json')
  .map(function (f) {
    // /path/to/tutorial.json
    f = path.resolve(f);

    // content of tutorial.json
    var json = fs.readJSONSync(path.resolve(f));

    // directory of the tutorial
    var dir = path.dirname(f);

    // by default, assume the path is where the files are located.
    json.path = json.path || path.basename(dir);
    json.tutorialCss = json.tutorialCss || [];
    json.tutorialJs = json.tutorialJs || [];
    json.bundle = '../bundle.js';

    // the output directory where the tutorial will be compiled
    var output = path.resolve('dist', 'tutorials', json.path);

    // create, empty, and copy the source directory
    fs.emptyDirSync(output);
    fs.copySync(dir, output);

    var fn = pug.compileFile(path.relative('.', path.resolve(dir, 'index.pug')), {pretty: true});
    fs.writeFileSync(path.resolve(output, 'index.html'), fn(json));
    return json;
  });

/* Sort tutorials.  Tutorials are sorted by level, order, title, and path.
 * undefined or null levels are orders are sorted after defined values.  level
 * should be used for the approximate difficulty of the tutorial, and order for
 * making specific tutorials appear sooner in the list. */
tutorials.sort(function (a, b) {
  if (a.level !== b.level) {
    return a.level === undefined ? 1 : b.level === undefined ? -1 : a.level - b.level;
  }
  if (a.order !== b.order) {
    return a.order === undefined ? 1 : b.order === undefined ? -1 : a.order - b.order;
  }
  if (a.title !== b.title) {
    return a.title < b.title ? -1 : 1;
  }
  return a.path < b.path ? -1 : 1;
});

// copy common files
fs.copySync('tutorials/common', 'dist/tutorials/common');

// create the main tutorial page
var data = {
  hideNavbar: false,
  tutorialCss: ['main.css'],
  tutorialJs: ['main.js'],
  tutorials: tutorials,
  bundle: './bundle.js',
  about: {hidden: true},
  title: 'GeoJS'
};

// copy assets for the main page
fs.copySync('tutorials/main.js', 'dist/tutorials/main.js');
fs.copySync('tutorials/main.css', 'dist/tutorials/main.css');

var fn = pug.compileFile('./tutorials/index.pug', {pretty: true});
fs.writeFileSync(
  path.resolve('dist', 'tutorials', 'index.html'),
  fn(data)
);
