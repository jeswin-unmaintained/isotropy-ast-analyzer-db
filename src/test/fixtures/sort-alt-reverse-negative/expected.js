module.exports = {
  type: "query",
  operation: "sort",
  fields: [
    {
      field: "priority",
      ascending: true
    }
  ],
  source: {
    type: "query",
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
};
