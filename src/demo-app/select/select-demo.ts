import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IItemTree } from '../../common/core';
import { CountriesListService } from "../services/countries-list.service";
import { CountriesService, ICountry } from "../services/countries.service";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'deja-select-demo',
    styleUrls: ['./select-demo.scss'],
    templateUrl: './select-demo.html',
})
export class SelectDemo extends OnInit {
    protected country: ICountry;
    private countries: Observable<ICountry[]>;
    private countriesForTemplate: ICountry[];
    private countriesForMultiselect: ICountry[];
    private groupedCountries: IItemTree[];
    private multiselectModel: IItemTree[];

    constructor(private countriesService: CountriesService, private countriesListService: CountriesListService) {
        super();
        this.multiselectModel = JSON.parse('[{"naqme":"ÅlandIslands","code":"AX","displayName":"ÅlandIslands","depth":0,"odd":true,"selected":true},{"naqme":"AmericanSamoa","code":"AS","displayName":"AmericanSamoa","depth":0,"odd":false,"selected":true},{"naqme":"Argentina","code":"AR","displayName":"Argentina","depth":0,"odd":false,"selected":true},{"naqme":"ChristmasIsland","code":"CX","displayName":"ChristmasIsland","depth":0,"odd":false,"selected":true},{"naqme":"Egypt","code":"EG","displayName":"Egypt","depth":0,"odd":true,"selected":true},{"naqme":"Dominica","code":"DM","displayName":"Dominica","depth":0,"odd":false,"selected":true}]');
    }

    public ngOnInit() {
        this.country = {
            code: 'CH',
            displayName: 'Switzerland',
            naqme: 'Switzerland',
        };

        this.countries = this.countriesService.getCountries();

        this.countriesService.getCountries().subscribe((value: ICountry[]) => {
            let result = [] as any[];
            value.map((s) => {
                s.toString = () => { return s.code + ' - ' + s.naqme; };
                result.push(s);
            });
            this.countriesForTemplate = result;
        }, (error) => this.handleError(error));

        this.countriesService.getCountries().subscribe((value: ICountry[]) => {
            /*let selection = {};
            event && event.selection.map(s => selection[s.code] = s);
            let result = [] as any[];
            value.map(s => {
              if (!selection[s.code]) {
                s.toString = () => { return s.code + ' - ' + s.naqme; };
                result.push(s);
              }
            });*/
            this.countriesForMultiselect = value;
            setTimeout(() => {
                this.multiselectModel = JSON.parse('[{"naqme":"ÅlandIslands","code":"AX","displayName":"ÅlandIslands","depth":0,"odd":true,"selected":true},{"naqme":"AmericanSamoa","code":"AS","displayName":"AmericanSamoa","depth":0,"odd":false,"selected":true},{"naqme":"Argentina","code":"AR","displayName":"Argentina","depth":0,"odd":false,"selected":true},{"naqme":"ChristmasIsland","code":"CX","displayName":"ChristmasIsland","depth":0,"odd":false,"selected":true},{"naqme":"Egypt","code":"EG","displayName":"Egypt","depth":0,"odd":true,"selected":true},{"naqme":"Dominica","code":"DM","displayName":"Dominica","depth":0,"odd":false,"selected":true}]');
            }, 10);
        }, (error) => this.handleError(error));

        this.countriesService.getCountries().subscribe((value: ICountry[]) => {
            let result = [] as ISelectCountry[];
            let map = {} as { [groupName: string]: ISelectCountry[] };
            value.map((country) => {
                let groupName = 'Group ' + country.naqme[0];
                if (!map[groupName]) {
                    map[groupName] = [] as IItemTree[];
                    result.push({
                        collapsible: true,
                        groupName: groupName,
                        items: map[groupName],
                    });
                }

                /*let subGroupName = 'Subgroup ' + country.naqme[1];
                if (!map[groupName + subGroupName]) {
                  map[groupName + subGroupName] = [] as IItemTree[];
                  map[groupName].push({
                    items: map[groupName + subGroupName],
                    suGroupName: subGroupName,
                    collapsible: true,
                  });
                }*/

                map[groupName].push(country);
            });

            this.groupedCountries = result;
        }, (error) => this.handleError(error));
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

interface ISelectCountry extends IItemTree {
    groupName?: string;
    suGroupName?: string;
    items?: IItemTree[];
}
