import { NgModule } from "@angular/core";
import { SortingService } from "../sorting/index";
import { GroupingService } from "./index";

@NgModule({
    providers: [SortingService, GroupingService],
})
export class GroupingModule { }
