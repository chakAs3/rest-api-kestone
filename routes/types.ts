import { BaseFields, BaseListTypeInfo, KeystoneListsAPI, ListConfig, ListSchemaConfig ,KeystoneContext} from '@keystone-6/core/types';
import {  Response } from 'express';

export interface EventHandler {
    (
        req: Request,
        res: Response,
        next: Function,
    ): void
}
export type Endpoint = {
    path: string
    method: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete' | 'connect' | 'options' | string
    handler: (req: LoadRequest,res: Response,next: Function) => any
    root?: boolean
}
export type ListRestAPIConfig = ListConfig<BaseListTypeInfo, BaseFields<any>> & {

    name: string
    endpoints: Endpoint[]
}

export type LoadRequest = Request & {
    listName: string
    context:KeystoneContext
}