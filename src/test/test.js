import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

function clean(obj) {
  if (typeof obj !== "object") {
    return obj;
  } else {
    if (Array.isArray(obj)) {
      return obj.map(o => clean(o));
    } else {
      const newObj = {};
      for (const key in obj) {
        if (
          ![
            "start",
            "end",
            "loc",
            "computed",
            "shorthand",
            "extra",
            "__clone",
            "path"
          ].includes(key)
        ) {
          newObj[key] = clean(obj[key]);
        }
      }
      return newObj;
    }
  }
}

describe("isotropy-ast-analyzer-db", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(__dirname, "fixtures", dir, `fixture.js`);
      const outputPath = path.resolve(__dirname, "fixtures", dir, `output.js`);
      const expected = require(`./fixtures/${dir}/expected`);
      const pluginInfo = makePlugin(opts);

      const babelResult = babel.transformFileSync(fixturePath, {
        plugins: [
          [
            pluginInfo.plugin,
            {
              databaseModules: {
                todosDbModule: "./dist/test/fixtures/my-db",
                backupDbModule: "./dist/test/fixtures/backup-db"
              }
            }
          ],
          "transform-object-rest-spread"
        ],
        parserOpts: {
          sourceType: "module",
          allowImportExportEverywhere: true
        },
        babelrc: false
      });
      const result = pluginInfo.getResult();
      const actual = clean(result.analysis);
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    ["collection", "collection"],
    ["count", "count"],
    // ["delete", "delete"],
    // ["import-select", "import-select", { import: true }],
    // ["import-update", "import-update", { import: true }],
    // ["insert", "insert"],
    ["map", "map"],
    ["map-slice", "map-slice"],
    ["select", "select"],
    // ["select-count", "select-count"],
    // ["select-map", "select-map"],
    // ["select-slice", "select-slice"],
    // ["select-sort", "select-sort"],
    ["slice", "slice"],
    ["slice-map", "slice-map"],
    // ["slice-single-param", "slice-single-param"],
    ["sort", "sort"],
    ["sort-desc", "sort-desc"],
    ["sort-alt", "sort-alt"],
    ["sort-alt-negative", "sort-alt-negative"],
    ["sort-alt-reverse", "sort-alt-reverse"],
    ["sort-alt-reverse-negative", "sort-alt-reverse-negative"],
    ["sort-alt-slice", "sort-alt-slice"],
    ["sort-slice", "sort-slice"],
    // ["update", "update"]
  ];

  for (const test of tests) {
    run(test);
  }
});
