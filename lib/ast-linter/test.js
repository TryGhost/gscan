// TODO: delete this file, put proper tests in place
const Linter = require('./');

const linter = new Linter();
const template = `
{{#post}}
    {{!-- allowed, inside post scope --}}
    {{#prev_post}}{{/prev_post}}
{{/post}}

{{!-- not allowed, outside post scope --}}
{{#next_post}}{{/next_post}}
`;

const messages = linter.verify({
    source: template,
    moduleId: 'test.hbs'
});

console.log(JSON.stringify(messages));