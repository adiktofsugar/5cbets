### boilerplate
mkdir 5cbets
cd 5cbets
npm init -y

### appengine
git init
git clone git@github.com:GoogleCloudPlatform/appengine-flask-skeleton.git appengine

#### app.yaml mods
```
- url: /media
  static_dir: media
```

### media
mkdir media
cd media
curl https://raw.githubusercontent.com/adiktofsugar/broccoli-react-skeleton/master/scripts/bash-install.sh | bash
cd ..
npm install; bower install
cp ../squaresplit/media/broccoli-eslint.js media/
npm install --save-dev broccoli-file-creator
bower install --save bootstrap

#### Brocfile.js mods

Adding ESLinter
```
var js = 'app/js';
js = new ESLinter(js);
js = babel(js, {
    modules: "amd",
    moduleIds: true,
    sourceMaps: 'inline'
});
js = new Funnel(js, {
    destDir: 'js'
});
```

Adding bootstrap and changing vendor files to go in vendor
```
var bootstrap = new Funnel('bower_components/bootstrap/dist', {
    destDir: 'vendor/bootstrap'
});
var vendor = mergeTrees([
    bootstrap,
    funnelForFile('bower_components/jquery/dist/jquery.min.js', 'vendor/jquery.js'),
    funnelForFile('bower_components/require/index.js', 'vendor/require.js'),
    funnelForFile(require.resolve('react/dist/react'), 'vendor/react.js'),
    funnelForFile(require.resolve('react-dom/dist/react-dom'), 'vendor/react-dom.js')
]);
````

Added require-config.js


### link appengine and media
cd appengine
ln -s ../media/dist media


### my custom eslinter
npm install --save-dev fs-extra eslint chalk glob broccoli-plugin

### part of the eslinter somehow
Added .eslintc.json to media/app/js
```
{
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "env": {
        "browser": true
    },

    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],

    "rules": {
        "no-unused-vars": 0,
        "curly": [1, "multi-line"],
        "no-bitwise": 1
    },

    "ecmaFeatures": {
        "jsx": true
    },

    "plugins": [ "react" ]
}

```
npm install --save-dev eslint-plugin-react babel-eslint
