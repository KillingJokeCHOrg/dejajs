import { AfterViewInit, Directive, ElementRef, forwardRef, HostBinding, QueryList, ViewChild } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { setTimeout } from 'timers';

/**
 * Directive pour rendre un textarea material redimensioné automatiquement au contenu.
 * Implémentation (créer un champ md-input-container>textarea et lui ajouter la directive deja-autosize
 * Attention, comme la directive utilise un validateur pour détecter les modifications de contenu du textarea, le textarea doit impérativement utiliser ngModel.
 */
@Directive({
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DejaAutosizeTextAreaDirective), multi: true },
    ],
    selector: 'textarea[deja-autosize][ngModel]',
})
export class DejaAutosizeTextAreaDirective implements AfterViewInit, Validator {
    @HostBinding('attr.rows') private rows = 1;

    constructor(private elementRef: ElementRef) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.resize();
        }, 0);
    }

    public validate(c: AbstractControl): { [key: string]: any } {
        this.resize();
        return null;
    }

    private resize() {
        let textAreaElement = this.elementRef.nativeElement as HTMLTextAreaElement;
        textAreaElement.style.height = 'auto';
        textAreaElement.style.height = textAreaElement.scrollHeight + 'px';
    }
}
