Package.describe({
  summary: 'Hybrid UI',
  version: '1.0.0',
  name: 'hybrid:ui',
  git: 'https://github.com/buildhybrid/ui.git'
});

Package.on_use(function (api) {
  api.export('HybridUI');
  api.export('THREE');
  api.export('Router');
  api.versionsFrom('METEOR@1.0');

  api.use([
    'jquery',
    'stylus',
    'blaze',
    'templating',
    'underscore',
    'infinitedg:tween',
    'peerlibrary:async',
    'grigio:babel'
  ],['client']);

  api.add_files([

    // Hybrid UI
    'export.js',

    // Lib
    'lib/three.js',
    'lib/TrackballControls.js',
    'lib/rate-limit.js',

    // Engine
    'src/engine/Curve.es6.js',
    'src/engine/Node.es6.js',
    'src/engine/Sprite.es6.js',
    'src/engine/Renderer.es6.js',
    'src/engine/Scene.es6.js',

    // Core Components
    'src/core/Modes.es6.js',
    'src/core/Sequence.es6.js',
    'src/core/FluidSequence.es6.js',
    'src/core/Responsive.es6.js',
    'src/core/TemplateNode.es6.js',
    'src/core/Transition.es6.js',
    'src/core/Swapper.es6.js',

    // Manger
    'src/manager/transitions.js',
    'src/manager/Manager.es6.js',
    'src/manager/Component.es6.js',
    'src/manager/Feature.es6.js',
    'src/manager/View.es6.js',

    // Compoents
    'src/components/ScrollView.es6.js',
    'src/components/Modal.es6.js',
    'src/components/Menu.es6.js',
    'src/components/TabBar.es6.js',
    'src/components/ListItem.es6.js',
    'src/components/Header.es6.js',
    'src/components/ProgressBar.es6.js',

    // Layouts
    'src/layouts/HeaderFooter.es6.js',
    'src/layouts/Full.es6.js',

    //Styles
    'src/styles/scroll-view.import.styl',
    'src/styles/swapper.import.styl',
    'src/styles/template-node.import.styl',
    'src/styles/engine.import.styl',
    'src/styles/styles.styl'

  ], 'client');

});