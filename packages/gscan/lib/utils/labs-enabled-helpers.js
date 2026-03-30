// Mapping of helper names to their Ghost labs flag names.
// When a Ghost feature is behind a labs flag, add the helper here
// so GScan includes it in knownHelpers when the flag is enabled.
//
// Usage:
//   1. Add an entry: { helperName: 'labsFlagName' }
//   2. Ghost passes { labs: { labsFlagName: true } } to GScan
//   3. GScan adds helperName to the spec's knownHelpers
//   4. When the helper graduates from labs, remove the entry
//
// Example (from when match was behind a labs flag):
//   module.exports = {
//       match: 'matchHelper'
//   };
module.exports = {
};
