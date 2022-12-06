import { Response } from "express"
import { LoadRequest } from "./types"
import type { Context } from '.keystone/types';

import queryString from 'query-string'
import { DbQuery, toDbQuery } from "./utils";
import { getWeekWithOptions } from "date-fns/fp";


export async function createHandler(req: LoadRequest, res: Response, next: Function) {

    const result = { message: "createHandler", model: `${req.destination}` }
    return res.json(result)
}
export async function findHandler(req: LoadRequest, res: Response, next: Function) {

    const reqQueryStringObject: object = (req as any)?.query
    console.log(' REQ  =====>>>', typeof (req as any)?.query, '<<<<======== REQ')
    //console.log('Query Object-->', queryString.parse((req as any)?.query))
    const findQuery = toDbQuery(reqQueryStringObject)
    console.log("----DbQuery-----", findQuery)


    //orderBy=%5B%7B%22name%22%3A%22asc%22%7D%5D&skip=20&take=10&where=%7B%22name%22%3A%7B%22startsWith%22%3A%22A%22%7D%7D
    //orderBy=%5B%7B%22name%22%3A%22asc%22%7D%5D&skip=20&take=10&where=%7B%22name%22%3A%7B%22startsWith%22%3A%22A%22%7D%7D
    //orderBy=%5B%7B%22name%22%3A%22asc%22%7D%5D&skip=20&take=10&where=%7B%22name%22%3A%7B%22startsWith%22%3A%22A%22%7D%7D
    const getResult = async (findQuery: DbQuery) => {
        let result;
        try {
            const hits = await req.context.db[req.listName].findMany(findQuery)
            result = { message: "findHandler", model: `${req.listName}`, hits: hits }
        } catch (graphQLError: any) {
            console.log('Errooor ', typeof graphQLError, Object.entries(graphQLError).concat())
            if (graphQLError.message.toString().contains('$where'))
                findQuery.where = undefined
            if (graphQLError.message.toString().contains('$orderBy'))
                findQuery.orderBy = undefined
            result = getResult(findQuery)
        }

        return result
    }


    return res.json(getResult(findQuery))
}
export async function findByIDHandler(req: LoadRequest, res: Response, next: Function) {

    const result = { message: "findByIDHandler" }
    return res.json(result)
}
export async function updateHandler(req: LoadRequest, res: Response, next: Function) {
    const result = { message: "updateHandler" }
    return res.json(result)
}
export async function deleteHandler(req: LoadRequest, res: Response, next: Function) {
    const result = { message: "deleteHandler" }
    return res.json(result)
}