const Components = require('../../components.json');
const fs = require('fs');
const render = require('json-templater/string');
const uppercamelcase = require('uppercamelcase');
const path = require('path');
const endOfLine = require('os').EOL;

const OUTPUT_PATH = path.join(__dirname, '../../src/examples.js');
const IMPORT_TEMPLATE = 'import {{name}} from \'./lib/{{component}}/examples/index.js\';';
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}';
const MAIN_TEMPLATE = `/* Generated by './tools/bin/build-example.js' */

{{include}}

const examples = [
{{install}}
];

const install = Vue => {
  examples.forEach((example) => {
    for (const n in example) {
      Vue.component(example[n].name, example[n]);
    }
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
`;

const ComponentNames = Object.keys(Components);
let includeComponentTemplate = [];
let installTemplate = [];
let listTemplate = [];


ComponentNames.forEach(name => {
  const componentName = uppercamelcase(name);

  try {
    fs.accessSync(`./src/lib/${name}/examples/index.js`, fs.constants.R_OK);

    includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
      name: componentName,
      component: name
    }));

    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));

    listTemplate.push(`  ${componentName}`);

  } catch (err) {}
});

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  list: listTemplate.join(',' + endOfLine)
});

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build example] DONE:', OUTPUT_PATH);
