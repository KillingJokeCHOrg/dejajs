import { Injectable } from '@angular/core';

@Injectable()
export class DragDropService {
    private static _dragInfos = {} as IDejaDragInfos;

    constructor() { }

    public get dragInfos() {
        return DragDropService._dragInfos;
    }

    public clearDragInfos() { 
        DragDropService._dragInfos = {};
    }
}

export interface IDejaDragInfos  {
    [key: string]: any;
}
