import { AfterViewInit, ContentChildren, Directive, forwardRef, QueryList } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { MdInput } from '@angular/material';
import { setTimeout } from 'timers';

/**
 * Directive pour rendre un textarea material (md-textarea) redimensioné automatiquement au contenu.
 * Implémentation (crée un champ md-textarea et lui ajouter la directive deja-autosize
 * Attention, comme la directive utilise un validateur pour détecter les modifications de contenu du textarea, le contrôle doit impérativement utiliser ngModel.
 */
@Directive({
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DejaAutosizeTextAreaDirective), multi: true },
    ],
    selector: 'md-textarea[deja-autosize][ngModel]',
})
export class DejaAutosizeTextAreaDirective implements AfterViewInit, Validator {
    @ContentChildren(MdInput)
    private set textAreas(value: QueryList<MdInput>) {
        this.textArea = value.first;
        this.textArea.rows = 1;
    }
    private textArea: MdInput;

    constructor() {
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
        if (this.textArea) {
            let textAreaElement = this.textArea._inputElement.nativeElement as HTMLElement;
            textAreaElement.style.height = 'auto';
            textAreaElement.style.height = (5 + textAreaElement.scrollHeight) + 'px';
        }
    }
}
