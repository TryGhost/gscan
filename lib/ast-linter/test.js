// TODO: delete this file, put proper tests in place
const Linter = require('./');

const linter = new Linter();
const template = `
{{#prev_post}}
    {{^next_post}} {{!-- invalid, direct nesting --}}
        No next post
    {{/next_post}}

    {{#foreach authors}}
        {{name}}
        {{#next_post}}{{title}}{{/next_post}} {{!-- invalid, inside author context --}}
    {{/foreach}}

    {{#get "post" as |post|}}
        {{#post}}
            {{#next_post}} {{!-- valid? only if nested async helpers are allowed --}}
                {{title}}
            {{/next_post}}
        {{/post}}
    {{/get}}
{{/prev_post}}`;

const messages = linter.verify({
    source: template,
    moduleId: 'test.hbs'
});

console.log(JSON.stringify(messages));