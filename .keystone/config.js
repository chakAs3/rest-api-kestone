var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields2 = require("@keystone-6/core/fields");
var lists = {
  Task: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      label: (0, import_fields.text)({ validation: { isRequired: true } }),
      priority: (0, import_fields2.select)({
        type: "enum",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" }
        ]
      }),
      isComplete: (0, import_fields.checkbox)(),
      assignedTo: (0, import_fields.relationship)({ ref: "Person.tasks", many: false }),
      finishBy: (0, import_fields.timestamp)()
    }
  }),
  Person: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      tasks: (0, import_fields.relationship)({ ref: "Task.assignedTo", many: true })
    }
  })
};

// seed-data/data.ts
var persons = [
  { name: "Lucy Wroblewski" },
  { name: "Ches Adebayor" },
  { name: "Tiff Jayden" },
  { name: "Henrique Urrea" }
];
var tasks = [
  {
    label: "Install Keystone in local dev \u{1F9EA}",
    isComplete: true,
    finishBy: "2021-01-01T02:30:00.000Z",
    assignedTo: "Lucy Wroblewski",
    priority: "high"
  },
  {
    label: "Model the content\u{1F4A1}",
    isComplete: true,
    finishBy: "2021-01-22T05:43:51.000Z",
    assignedTo: "Ches Adebayor",
    priority: "high"
  },
  {
    label: "Architect the data schema \u{1F517}",
    isComplete: true,
    finishBy: "2021-02-02T20:02:37.000Z",
    assignedTo: "Lucy Wroblewski",
    priority: "high"
  },
  {
    label: "Design the UI \u{1F485}\u{1F3FC}",
    isComplete: true,
    finishBy: "2021-02-24T22:17:07.000Z",
    assignedTo: "Tiff Jayden",
    priority: "medium"
  },
  {
    label: "Publish the content \u{1F4DD}",
    isComplete: true,
    finishBy: "2021-03-01T05:41:37.000Z",
    assignedTo: "Ches Adebayor",
    priority: "low"
  },
  {
    label: "Query content over GraphQL\u{1F50E}",
    isComplete: false,
    finishBy: "2021-03-21T05:41:37.000Z",
    assignedTo: "Lucy Wroblewski",
    priority: "medium"
  },
  {
    label: "Implement the UI design in code \u{1F5BC}",
    isComplete: false,
    finishBy: "2021-03-23T05:41:37.000Z",
    assignedTo: "Henrique Urrea",
    priority: "medium"
  },
  {
    label: "Deploy Keystone backend to the web \u2601\uFE0F",
    isComplete: false,
    finishBy: "2021-03-30T05:41:37.000Z",
    assignedTo: "Lucy Wroblewski",
    priority: "low"
  },
  {
    label: "Launch project \u{1F680}",
    isComplete: false,
    finishBy: "2021-04-01T05:41:37.000Z",
    assignedTo: "Lucy Wroblewski",
    priority: "low"
  }
];

// seed-data/index.ts
async function insertSeedData(context) {
  console.log(`\u{1F331} Inserting seed data`);
  const createPerson = async (personData) => {
    let person = await context.query.Person.findOne({
      where: { name: personData.name },
      query: "id"
    });
    if (!person) {
      person = await context.query.Person.createOne({
        data: personData,
        query: "id"
      });
    }
  };
  const createTask = async (taskData) => {
    let persons2 = await context.query.Person.findMany({
      where: { name: { equals: taskData.assignedTo } },
      query: "id"
    });
    await context.query.Task.createOne({
      data: { ...taskData, assignedTo: { connect: { id: persons2[0].id } } },
      query: "id"
    });
  };
  for (const person of persons) {
    console.log(`\u{1F469} Adding person: ${person.name}`);
    await createPerson(person);
  }
  for (const task of tasks) {
    console.log(`\u{1F518} Adding task: ${task.label}`);
    await createTask(task);
  }
  console.log(`\u2705 Seed data inserted`);
  console.log(`\u{1F44B} Please start the process with \`yarn dev\` or \`npm run dev\``);
  process.exit();
}

// routes/utils.ts
var import_query_string = __toESM(require("query-string"));
function toDbQuery(qstrObject) {
  console.log("----qstr------->", qstrObject);
  const queryOject = qstrObject;
  console.log("----->", queryOject);
  Object.entries(queryOject).forEach(async ([key, value]) => {
    queryOject[key] = JSON.parse(value);
  });
  return queryOject;
}

// routes/handlers.ts
async function createHandler(req, res, next) {
  const result = { message: "createHandler", model: `${req.destination}` };
  return res.json(result);
}
async function findHandler(req, res, next) {
  const reqQueryStringObject = req?.query;
  console.log(" REQ  =====>>>", typeof req?.query, "<<<<======== REQ");
  const findQuery = toDbQuery(reqQueryStringObject);
  console.log("----DbQuery-----", findQuery);
  const getResult = async (findQuery2) => {
    let result;
    try {
      const hits = await req.context.db[req.listName].findMany(findQuery2);
      result = { message: "findHandler", model: `${req.listName}`, hits };
    } catch (sqlError) {
      console.log("Errooor ", typeof sqlError, Object.entries(sqlError).concat());
      result = { message: "findHandler x Error x", model: `${req.listName}`, hits: [] };
      findQuery2.where = void 0;
      result = getResult(findQuery2);
    }
    return result;
  };
  return res.json(getResult(findQuery));
}
async function findByIDHandler(req, res, next) {
  const result = { message: "findByIDHandler" };
  return res.json(result);
}
async function updateHandler(req, res, next) {
  const result = { message: "updateHandler" };
  return res.json(result);
}
async function deleteHandler(req, res, next) {
  const result = { message: "deleteHandler" };
  return res.json(result);
}

// routes/tasks.ts
var import_express = __toESM(require("express"));
async function generateRoutes(app, commonContext, lists2) {
  Object.entries(lists2).forEach(async ([key, value]) => {
    let list2 = value;
    let restApiList = { ...list2, name: key, endpoints: [] };
    let endpoints = createEndpoints(restApiList);
    restApiList.endpoints = endpoints;
    console.log(restApiList);
    mountEndpoints(app, commonContext, restApiList);
  });
}
function mountEndpoints(app, commonContext, listObject) {
  const router = import_express.default.Router();
  const listNameFun = async (req, res, next) => {
    req.context = await commonContext(req, res);
    req.listName = listObject.name;
    next();
  };
  router.use(listNameFun);
  app.use(`/rest/${listObject.name.toLowerCase()}`, router);
  listObject.endpoints.forEach((endpoint) => {
    console.log(endpoint.method, `/rest/${listObject.name}${endpoint.path}`, endpoint.handler);
    router[endpoint.method](`${endpoint.path}`, endpoint.handler);
  });
}
function createEndpoints(listObject) {
  let { endpoints, name } = listObject;
  return endpoints.concat([
    {
      path: "/",
      method: "get",
      handler: findHandler
    },
    {
      path: "/",
      method: "post",
      handler: createHandler
    },
    {
      path: "/:id",
      method: "put",
      handler: updateHandler
    },
    {
      path: "/:id",
      method: "patch",
      handler: updateHandler
    },
    {
      path: "/:id",
      method: "get",
      handler: findByIDHandler
    },
    {
      path: "/:id",
      method: "delete",
      handler: deleteHandler
    }
  ]);
  throw new Error("Function not implemented.");
}

// keystone.ts
var keystone_default = (0, import_core2.config)({
  db: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./keystone-example.db",
    async onConnect(context) {
      if (process.argv.includes("--seed-data")) {
        await insertSeedData(context);
      }
    }
  },
  server: {
    extendExpressApp: (app, commonContext) => {
      generateRoutes(app, commonContext, lists);
    }
  },
  lists
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
