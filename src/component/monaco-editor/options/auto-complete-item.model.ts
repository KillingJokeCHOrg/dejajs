/**
 * Representation of AutoCompleteItem
 */
export class AutoCompleteItem {
    public label: string;
    public kind: number;
    public documentation: string;
    public insertText: string;

    constructor() {

    }

    public setLabel(label: string): AutoCompleteItem {
        this.label = label;
        return this;
    }

    public setKind(kind: number): AutoCompleteItem {
        this.kind = kind;
        return this;
    }

    public setDocumentation(documentation: string): AutoCompleteItem {
        this.documentation = documentation;
        return this;
    }

    public setInsertText(insertText: string): AutoCompleteItem {
        this.insertText = insertText;
        return this;
    }
}
