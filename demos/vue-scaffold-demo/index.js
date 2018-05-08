
const path = require('path');
const fs = require('fs');

const gulpfile = require('./gulpfile');

gulpfile({
    srcDir: path.join(__dirname, 'src'),
    buildDir: path.join(__dirname, 'build'),
    debugPort: 9000
});
