import { IDejaGridColumn } from "../index";

export interface IDejaGridGroupsEvent { 
    originalEvent: Event;
    column: IDejaGridColumn;
    columns: IDejaGridColumn[];
}
