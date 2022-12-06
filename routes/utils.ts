import queryString from 'query-string'

export function toQueryString( query :Object): string {

    // {where:JSON.stringify( {name: { startsWith: 'A' } }),take: 10,skip: 20,orderBy:JSON.stringify( [{name: 'asc' }]) }
    Object.entries(query).forEach(async ([key, value]) => {

        query[key]= JSON.stringify(value)
    })
   return  queryString.stringify(query)  
}

export function toDbQuery(qstrObject:object ):DbQuery{
    console.log("----qstr------->",qstrObject)
    const queryOject:DbQuery | Object = qstrObject
    console.log("----->",queryOject)
    Object.entries(queryOject).forEach(async ([key, value]) => {

        queryOject[key]= JSON.parse(value)
    })

    return queryOject
}


type GraphQLInput = Record<any, any>;

export type DbQuery = {

    where?: GraphQLInput |  undefined ;
    take?: number | undefined;
    skip?: number | undefined;
    orderBy?: Record<string, "asc" | "desc" | null> | undefined;
    query?:string;
}