import type { Request, Response } from 'express';
import type { Context  } from '.keystone/types';
import { BaseFields, BaseListTypeInfo, CreateRequestContext, KeystoneListsAPI, ListConfig ,ListSchemaConfig } from '@keystone-6/core/types';
import { createHandler, deleteHandler, findByIDHandler, findHandler, updateHandler } from './handlers';
import { ListRestAPIConfig , Endpoint, LoadRequest } from './types';
import e from 'express';
import express from 'express';



/*
  This example route handler gets all the tasks in the database and returns
  them as JSON data, emulating what you'd normally do in a REST API.

  More sophisticated API routes might accept query params to select fields,
  map more params to `where` arguments, add pagination support, etc.

  We're also demonstrating how you can query related data through the schema.
*/




export async function getTasks(req: Request, res: Response) {
  // This was added by the context middleware in ../keystone.ts
  const { context } = req as typeof req & { context: Context };

  // Let's map the `complete` query param to a where filter
  let isComplete;
  if (req.query.complete === 'true') {
    isComplete = { equals: true };
  } else if (req.query.complete === 'false') {
    isComplete = { equals: false };
  }
  // Now we can use it to query the Keystone Schema
  const tasks = await context.query.Task.findMany({
    where: {
      isComplete,
    },
    query: `
      id
      label
      priority
      isComplete
      assignedTo {
        id
        name
      }
    `,
  });
  // And return the result as JSON
  res.json(tasks);
}

export async function  generateRoutes(app: e.Express,commonContext:CreateRequestContext<any>,lists:ListSchemaConfig){
 
  
  Object.entries(lists).forEach(async ([key, value]) => {

    let list = value
    let restApiList : ListRestAPIConfig= {...list,name:key,endpoints:[] }

    let endpoints= createEndpoints(restApiList)
    restApiList.endpoints = endpoints
    console.log(restApiList)

    mountEndpoints(app,commonContext , restApiList)
    
  });
  

}

function mountEndpoints(app:e.Express,commonContext:CreateRequestContext<any>,listObject:ListRestAPIConfig){

  const router = express.Router()

  const listNameFun = async (req,res,next)=>{ 
    req.context = await commonContext(req,res)
    req.listName = listObject.name ;
    next()
  }

  router.use(listNameFun)
  app.use(`/rest/${listObject.name.toLowerCase()}`, router);
  
  listObject.endpoints.forEach(endpoint => {
    console.log(endpoint.method,`/rest/${listObject.name}${endpoint.path}`,endpoint.handler )
    router[endpoint.method](`${endpoint.path}`, endpoint.handler);
    
  }); 
}

function createEndpoints(listObject: ListRestAPIConfig):Endpoint[] {
 
  let { endpoints,name } = listObject 
  return endpoints.concat([
    {
      path: '/',
      method: 'get',
      handler: findHandler,
    },
    {
      path: '/',
      method: 'post',
      handler: createHandler,
    },
    {
      path: '/:id',
      method: 'put',
      handler: updateHandler,
    },
    {
      path: '/:id',
      method: 'patch',
      handler: updateHandler,
    },
    {
      path: '/:id',
      method: 'get',
      handler: findByIDHandler,
    },
    {
      path: '/:id',
      method: 'delete',
      handler: deleteHandler,
    }
  ]);


  throw new Error('Function not implemented.');
}
