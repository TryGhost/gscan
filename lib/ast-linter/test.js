// TODO: delete this file, put proper tests in place
const Linter = require('./');

const linter = new Linter();
const template = `
{{#post}}
    {{@config.posts_per_page}}
    {{@unknown}}
{{/post}}

{{@site.url}}
{{@config.psts_per_page}}
`;

const messages = linter.verify({
    source: template,
    moduleId: 'test.hbs'
});

console.log(JSON.stringify(messages));