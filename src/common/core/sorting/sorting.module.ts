import { NgModule } from "@angular/core";
import { DejaSortIndicatorComponent, SortingService} from "./index";

@NgModule({
    declarations: [DejaSortIndicatorComponent],
    exports: [DejaSortIndicatorComponent],
    providers: [SortingService],
})
export class DejaSortingModule { }
