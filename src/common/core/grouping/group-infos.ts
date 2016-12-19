import { ISortInfos } from "../sorting/index";

export interface IGroupInfo { 
    sortInfos?: ISortInfos;
    groupByField: ((model: any) => string) | string;
    groupTextField?: ((model: any) => string) | string;
}
