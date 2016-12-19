import { Component, Input } from '@angular/core';

@Component({
    selector: 'deja-bold-query',
    styleUrls: [
        './bold-query.component.scss',
    ],
    template: `<span id="word" *ngFor="let word of wordList"><span id="content" *ngFor="let content of word" [ngClass]="content.className">{{ content.content }}</span></span>`,
})
export class DejaBoldQueryComponent {
    private _query: string;
    private _value: any;
    private wordList = [] as IContent[][];

    @Input()
    set query(value) {
        if (this._query !== value) {
            this._query = value;
            this.refresh();
        }
    }

    @Input()
    public set value(value: any) {
        this._value = value;
        this.refresh();
    }

    private refresh() {
        if (this._value && this._query && this._query.length) {
            let sc = new RegExp(this._query, 'i');
            let value = this._value.toString() as string;
            let words = value.split(' ');
            let queryLength = this._query.length;
            this.wordList = [];
            let position = 0;
            words.forEach((word) => {
                if (word.length) {
                    let contents = [] as IContent[];
                    let splitted = word.split(sc);
                    if (splitted.length === 1) {
                        contents.push({ content: word } as IContent);
                    } else {
                        splitted.forEach((text) => {
                            if (text) {
                                contents.push({
                                    className: null,
                                    content: text,
                                } as IContent);
                            }
                            position += text.length;
                            if (position + queryLength <= word.length) {
                                contents.push({
                                    className: 'bold',
                                    content: word.slice(position, position + queryLength),
                                });
                                position += queryLength;
                            }
                        });
                    }
                    this.wordList.push(contents);
                }    
            });
        } else {
            this.wordList.push([{
                className: null,
                content: this._value,
            }]);
        }
    }
}

interface IContent {
    content: string;
    className?: string;
}
