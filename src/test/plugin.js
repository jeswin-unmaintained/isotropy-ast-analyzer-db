import * as analyzers from "../";

export default function(opts) {
  let config = {};

  let state = {
    importsAdded: []
  };

  let _analysis, _state;

  function analyze(fn, path, state, config) {
    const analysis = fn(path, state, config);
    path.skip();
    if (analysis !== undefined) {
      _analysis = analysis.value;
      _state = state;
    }
  }

  return {
    plugin: {
      pre(state) {
        this.config = this.opts ? { ...config, ...this.opts } : config;
      },
      visitor: {
        ImportDeclaration(path) {
          analyzeAssignmentExpression(
            analyzers.meta.analyzeImportDeclaration,
            path,
            state,
            this.config
          );
          path.skip;
        },

        AssignmentExpression(path) {
          analyze(analyzers.write.analyzeAssignmentExpression, path, state, this.config);
        },

        MemberExpression(path) {
          analyze(analyzers.read.analyzeMemberExpression, path, state, this.config);
        },

        CallExpression(path) {
          analyze(analyzers.read.analyzeCallExpression, path, state, this.config);
        }
      }
    },
    getResult: () => {
      return { analysis: _analysis, state: _state };
    }
  };
}
