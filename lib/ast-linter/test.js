// TODO: delete this file, put proper tests in place
const Linter = require('./');

const linter = new Linter();
const template = `
    {{test}}
    {{#if img_url feature_image}}
        {{feature_image}}
    {{/if}}
`;

const messages = linter.verify({
    source: template,
    moduleId: 'test.hbs'
});

console.log(JSON.stringify(messages)); // eslint-disable-line no-console