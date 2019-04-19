// TODO: delete this file, put proper tests in place
const Linter = require('./');

const linter = new Linter();
const template = `
{{#prev_post}}
    {{^next_post}}
        No next post
    {{/next_post}}
{{/prev_post}}

{{#get "post"}}
    {{ghost_head}}

    {{#post}}
        {{#next_post}}
        {{/next_post}}
    {{/post}}
{{/get}}
`;

const messages = linter.verify({
    source: template,
    moduleId: 'test.hbs'
});

console.log(JSON.stringify(messages));