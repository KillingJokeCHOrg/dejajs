import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { CountriesService, ICountry } from "../services/countries.service";
import { IItemTree, GroupingService, IGroupInfo } from '../../common/core';
import { IDejaDragEvent, DejaTreeListItemsEvent, DejaTreeListComponent } from '../../component';
import { Observable } from 'rxjs/Rx';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'deja-tree-list-demo',
    styleUrls: ['./tree-list-demo.scss'],
    templateUrl: './tree-list-demo.html',
})
export class DejaTreeListDemo {
    private groupedCountries: IItemTree[];
    private countries: Observable<ICountry[]>;
    private selectedItemsOut: IItemTree[];
    private selectedInfos = [];
    @ViewChild('groupedtreelist') private groupedTreeList: DejaTreeListComponent;

    constructor(private countriesService: CountriesService, groupingService: GroupingService) {
        this.countries = this.countriesService.getCountries(null, 412);
        // this.countries = this.countriesService.getCountries(null, 1);

        this.countriesService.getCountries(null, 1).subscribe((values) => {
            let extendedCountries = values.map((country) => {
                return {
                    code: country.code,
                    displayName: country.displayName,
                    groupName: country.naqme[0],
                    naqme: country.naqme,
                    subGroupName: country.naqme[0] + country.naqme[1],
                } as IExtendedCountry;
            });

            let groupInfos = [
                {
                    groupByField: 'groupName',
                }, {
                    groupByField: 'subGroupName',
                },
            ] as IGroupInfo[];

            groupingService.group(extendedCountries, groupInfos, 'children').then((groupedResult) => {
                this.groupedCountries = groupedResult;
            });
        });
    }

    protected onSelectionChanged(e: DejaTreeListItemsEvent) {
        // Ne jamais binder la sortie et l'entree des selections sur la meme variable
        this.selectedItemsOut = e.items;
        this.selectedInfos = [];
        e.items.forEach((item) => {
            let treeItem = item as IItemTree;
            let country = item as IExtendedCountry;
            switch (treeItem.depth) {
                case 0:
                    return 'Group ' + treeItem.toString();
                case 1:
                    return 'Subgroup ' + treeItem.toString();
                default:
                    this.groupedTreeList.getParentListInfos(item).then((parentInfos) => {
                        let parentDisplayName = parentInfos && parentInfos.parent ? parentInfos.parent.toString() : 'none';
                        this.selectedInfos.push('Country: ' + country.naqme + ' (' + country.code + ')' + (parentInfos ? '    parent: ' + parentDisplayName + ' (' + parentInfos.index + ')' : ''));
                    });
            }
        });
    }

    protected onItemDragStart(event: IDejaDragEvent) {
        let itm = event.dragObject as IItemTree;
        if (itm.depth === 2) {
            event.dragInfo['country'] = event.dragObject;
        }
    }

    protected onDivDragOver(event: IDejaDragEvent) {
        if (event.dragInfo.hasOwnProperty('country')) {
            event.preventDefault();
        }
    }

    protected onDivDropEvent(event: IDejaDragEvent) {
        if (event.dragInfo.hasOwnProperty('country')) {
            let country = event.dragInfo['country'] as ICountry;
            (event.target as HTMLElement).innerText = `The dropped country is ${country.naqme} - the code is: ${country.code}`;
            event.preventDefault();
        }
    }

    protected onSuffixClicked() {
        this.groupedCountries[0].$items[0].$items.push({
            code: 'te',
            displayName: 'test',
            naqme: 'te',
        } as ICountry);
        this.groupedTreeList.refresh();
    }
}

interface IExtendedCountry extends ICountry {
    groupName: string;
    subGroupName: string;
}
