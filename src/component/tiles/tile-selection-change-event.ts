import { IDejaTile } from './index';

export class DejaTileSelectionChangedEvent extends Event {
    public selectedTiles: IDejaTile[];
}