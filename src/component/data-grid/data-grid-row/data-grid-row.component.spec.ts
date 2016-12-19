import { TestBed, inject } from '@angular/core/testing';

import { DejaGridRowComponent } from './data-grid-row.component';

describe('a data-grid-row component', () => {
    let component: DejaGridRowComponent;

    // register all needed dependencies
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DejaGridRowComponent
            ]
        });
    });

    // instantiation through framework injection
    beforeEach(inject([DejaGridRowComponent], (DejaGridRowComponent) => {
        component = DejaGridRowComponent;
    }));

    it('should have an instance', () => {
        expect(component).toBeDefined();
    });
});
