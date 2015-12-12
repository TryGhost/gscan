# Ghost Theme Check
 
## Check List

Done:

- [ ] Warning: package.json exists
- [ ] Warning: package.json is correctly formatted
- [ ] Warning: package.json contains name and version (to match current Ghost)
- [ ] Recommendation: package.json contains all the other recommended fields
- [ ] Error: index.hbs exists
- [ ] Error: post.hbs exists
- [ ] Recommendation: default.hbs exists
- [ ] Error: {{ghost_head}} exists
- [ ] Error: {{ghost_foot}} exists

Todo:

- [ ] Error: {{asset}} helper is present
- [ ] Warning: css files include resources with query params
- [ ] Warning: pageUrl is deprecated
- [ ] Warning: css use body classes which are deprecated

Feature detection:

- image
- asset
- ghost_head
- internal tags won't work correctly if using `{{foreach tags}}` instead of `{{tags}}`
- content 0 hack



Note: package.json warnings should be upgraded to errors.

