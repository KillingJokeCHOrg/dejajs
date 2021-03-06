import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { setTimeout } from 'timers';
import { Rect } from '../../common/core/graphics';
import { KeyCodes } from '../../common/core/keycodes.enum';

/** Place un conteneur déroulant */
@Component({
    selector: 'deja-dropdown',
    styleUrls: [
        './dropdown.component.scss',
    ],
    template: `<ng-content></ng-content>`,
})
export class DejaDropDownComponent implements AfterViewInit {
    /** Déclenché lorsque le conteneur déroulant disparait */
    @Output() public hide = new EventEmitter();

    /** Renvoie ou définit une valeur indiquant si le conteneur déroulant se ferme sur pression de la touche Echap */
    @Input() public closeOnEscape = true;

    /** Renvoie ou définit l'élement du DOM sur lequel le conteneur déroulant devra s'aligner */
    @Input() public ownerElement: any;

    /** Marge en pixel à gauche entre le conteneur déroulant et l'élement propriétaire */
    @Input() public ownerLeftMargin = 0;

    /** Marge en pixel en haut entre le conteneur déroulant et l'élement propriétaire */
    @Input() public ownerTopMargin = 0;

    /** Marge en pixel à droite entre le conteneur déroulant et l'élement propriétaire */
    @Input() public ownerRightMargin = 0;

    /** Marge en pixel en bas entre le conteneur déroulant et l'élement propriétaire */
    @Input() public ownerBottomMargin = 0;

    /** Element dans lequel le conteneur déroulant doit s'afficher (le conteneur déroulant ne peut dépasser de l'élement spécifié ici) */
    @Input() public containerElement: any;

    /** Renvoie ou définit une valeur indiquant si le conteneur déroulant peut s'afficher par dessus son propriétaire */    
    @Input() public avoidOnwerOverflow = true;

    @HostBinding('attr.valign') private valign = null;
    @HostBinding('attr.halign') private halign = null;
    @HostBinding('style.left.px') private left = -1000;
    @HostBinding('style.top.px') private top = -1000;
    @HostBinding('style.width.px') private width = null as number;
    @HostBinding('style.height.px') private height = null as number;

    private keyDownObs: Subscription;

    private ownerAlignents = {
        bottom: false,
        left: false,
        right: false,
        top: false,
    };

    private dropdownAlignments = {
        bottom: false,
        left: false,
        right: false,
        top: false,
    };

    /** Point de référence du propriétaire pour l'alignement du conteneur déroulant. Valeurs possible: top, bottom, right, left. Une combinaison des ces valeurs peut également être utilisée, par exemple 'top left'. */  
    @Input() set ownerAlignment(value: string) {
        this.ownerAlignents = {
            bottom: false,
            left: false,
            right: false,
            top: false,
        };

        value && value.split(/\s+/).map((align) => this.ownerAlignents[align] = true);
    }

    /** Ancre d'alignement du conteneur déroulant. Valeurs possible: top, bottom, right, left. Une combinaison des ces valeurs peut également être utilisée, par exemple 'top left'. */
    @Input() set dropdownAlignment(value: string) {
        this.dropdownAlignments = {
            bottom: false,
            left: false,
            right: false,
            top: false,
        };

        value && value.split(/\s+/).map((align) => this.dropdownAlignments[align] = true);
    }

    constructor(private elementRef: ElementRef) {
    }

    public ngAfterViewInit() {
        this.show();
    }

    public show() {
        this.height = null;
        setTimeout(() => {
            // Calc owner screen position
            let ownerRect = this.ownerElement.getBoundingClientRect();
            let ownerBounds = Rect.fromLTRB(ownerRect.left + +this.ownerLeftMargin, ownerRect.top + +this.ownerTopMargin, ownerRect.right - +this.ownerRightMargin, ownerRect.bottom - +this.ownerBottomMargin);

            // Calc container screen position
            let body = this.elementRef.nativeElement.ownerDocument.body;
            let bodyRect = body.getBoundingClientRect();
            let containerRect = !this.containerElement ? bodyRect : this.containerElement.getBoundingClientRect();

            // Calc min max relative to screen
            let minLeft = Math.max(bodyRect.left, containerRect.left);
            let maxRight = Math.min(bodyRect.right, containerRect.right);
            let minTop = Math.max(bodyRect.top, containerRect.top);
            let maxBottom = Math.min(bodyRect.bottom, containerRect.bottom);

            // Calc dropdown screen position                
            let dropdownContElement = this.elementRef.nativeElement as HTMLElement;
            let dropdownRect = dropdownContElement.getBoundingClientRect();
            let left: number;
            let top: number;
            let width = dropdownRect.width;
            let height = dropdownRect.height;

            // Calc container absolute alignment
            if (this.ownerAlignents.left) {
                if (this.dropdownAlignments.left) {
                    left = ownerBounds.left;
                } else if (this.dropdownAlignments.right) {
                    left = ownerBounds.left - width;
                } else {
                    left = ownerBounds.left - width / 2;
                }
            }

            if (this.ownerAlignents.top) {
                if (this.dropdownAlignments.top) {
                    top = ownerBounds.top;
                } else if (this.dropdownAlignments.bottom) {
                    top = ownerBounds.top - height;
                } else {
                    top = ownerBounds.top + ownerBounds.height / 2 - height / 2;
                }
            }

            if (this.ownerAlignents.right) {
                if (this.ownerAlignents.left) {
                    width = ownerBounds.width;
                } else if (this.dropdownAlignments.left) {
                    left = ownerBounds.right();
                } else if (this.dropdownAlignments.right) {
                    left = ownerBounds.right() - width;
                } else {
                    left = ownerBounds.right() - width / 2;
                }
            }

            if (this.ownerAlignents.bottom) {
                if (this.ownerAlignents.top) {
                    height = ownerBounds.height;
                } else if (this.dropdownAlignments.top) {
                    top = ownerBounds.bottom();
                } else if (this.dropdownAlignments.bottom) {
                    top = ownerBounds.bottom() - height;
                } else {
                    top = ownerBounds.bottom() - height / 2;
                }
            }

            if (top === undefined) {
                top = ownerBounds.top + ownerBounds.height / 2 - height / 2;
            }

            if (left === undefined) {
                left = ownerBounds.left + ownerBounds.width / 2 - width / 2;
            }

            let dropdownBounds = new Rect(left, top, width, height);

            // Ensure container bounds
            if (minLeft > dropdownBounds.left) {
                dropdownBounds.left = minLeft;
            }

            if (minTop > dropdownBounds.top) {
                dropdownBounds.top = minTop;
            }

            if (dropdownBounds.right() > maxRight && this.dropdownAlignments.right) {
                dropdownBounds.left = Math.max(maxRight - dropdownBounds.width, minLeft);
            }

            if (dropdownBounds.bottom() > maxBottom && this.dropdownAlignments.bottom) {
                dropdownBounds.top = Math.max(maxBottom - dropdownBounds.height, minTop);
            }

            if (dropdownBounds.intersectWith(ownerBounds) && this.avoidOnwerOverflow) {
                // Try a better aligment
                if (dropdownBounds.left < ownerBounds.right() && dropdownBounds.right() > ownerBounds.left) {
                    let overflowTop = dropdownBounds.bottom() - ownerBounds.top;
                    let overflowBottom = ownerBounds.bottom() - dropdownBounds.top;
                    if (overflowTop > 0 && overflowBottom > 0) {
                        let topHeight = Math.min(ownerBounds.top - minTop, dropdownBounds.height);
                        let bottomHeight = Math.min(maxBottom - ownerBounds.bottom(), dropdownBounds.height);
                        if (overflowBottom > 0 && bottomHeight < topHeight) {
                            dropdownBounds.top = ownerBounds.top - topHeight;
                            if (dropdownBounds.height > topHeight) {
                                dropdownBounds.height = topHeight;
                            }
                        } else {
                            dropdownBounds.top = ownerBounds.bottom();
                            if (dropdownBounds.height > bottomHeight) {
                                dropdownBounds.height = bottomHeight;
                            }
                        }
                    }
                }

                if (dropdownBounds.top < ownerBounds.bottom() && dropdownBounds.bottom() > ownerBounds.top) {
                    let overflowLeft = dropdownBounds.right() - ownerBounds.left;
                    let overflowRight = ownerBounds.right() - dropdownBounds.left;
                    if (overflowLeft > 0 && overflowRight > 0) {
                        let leftWidth = Math.min(ownerBounds.left - minLeft, dropdownBounds.width);
                        let rightWidth = Math.min(maxRight - ownerBounds.right(), dropdownBounds.width);
                        if (overflowRight > 0 && rightWidth < leftWidth) {
                            dropdownBounds.left = ownerBounds.left - leftWidth;
                            if (dropdownBounds.width > leftWidth) {
                                dropdownBounds.width = leftWidth;
                            }
                        } else {
                            dropdownBounds.left = ownerBounds.right();
                            if (dropdownBounds.width > rightWidth) {
                                dropdownBounds.width = rightWidth;
                            }
                        }
                    }
                }
            }

            // Ensure container bounds
            if (minLeft > dropdownBounds.left) {
                // Recalc new position
                dropdownBounds.left = minLeft;
                if (this.dropdownAlignments.right) {
                    // Right blocked
                    if (this.ownerAlignents.left) {
                        dropdownBounds.width = Math.max(5, ownerBounds.left - minLeft);
                    } else if (this.ownerAlignents.right) {
                        dropdownBounds.width = ownerBounds.right() - minLeft;
                    }
                }
            }

            if (minTop > dropdownBounds.top) {
                dropdownBounds.top = minTop;
                if (this.dropdownAlignments.bottom) {
                    // Bottom blocked
                    if (this.ownerAlignents.top) {
                        dropdownBounds.height = Math.max(5, ownerBounds.top - minTop);
                    } else if (this.ownerAlignents.bottom) {
                        dropdownBounds.height = ownerBounds.bottom() - minTop;
                    }
                }
            }

            if (dropdownBounds.right() > maxRight) {
                if (this.dropdownAlignments.left) {
                    // Left blocked
                    dropdownBounds.width = maxRight - dropdownBounds.left;
                } else if (maxRight - dropdownBounds.width < minLeft) {
                    // Limited width
                    dropdownBounds.left = minLeft;
                    dropdownBounds.width = maxRight - minLeft;
                } else {
                    dropdownBounds.left = maxRight - dropdownBounds.width;
                }
            }

            if (dropdownBounds.bottom() > maxBottom) {
                if (this.dropdownAlignments.top) {
                    // Top blocked
                    dropdownBounds.height = maxBottom - dropdownBounds.top;
                } else if (maxBottom - dropdownBounds.height < minTop) {
                    // Limited height
                    dropdownBounds.top = minTop;
                    dropdownBounds.height = maxBottom - minTop;
                } else {
                    dropdownBounds.top = maxBottom - dropdownBounds.height;
                }
            }

            if (dropdownBounds.top >= ownerBounds.bottom()) {
                this.valign = 'bottom';
            } else if (dropdownBounds.bottom() <= ownerBounds.top) {
                this.valign = 'top';
            } else {
                this.valign = 'center';
            }

            if (dropdownBounds.left >= ownerBounds.right()) {
                this.halign = 'right';
            } else if (dropdownBounds.right() <= ownerBounds.left) {
                this.halign = 'left';
            } else {
                this.halign = 'center';
            }

            // Convert to relative
            let parentElement = dropdownContElement.offsetParent as HTMLElement;
            let parentRect = parentElement && parentElement.getBoundingClientRect();
            let relativeBounds = (parentRect && dropdownBounds.offset(- parentRect.left, - parentRect.top)) || dropdownBounds;

            this.left = relativeBounds.left;
            this.top = relativeBounds.top;
            this.width = relativeBounds.width;
            this.height = relativeBounds.height;

            this.keyDown = this.closeOnEscape;
        }, 0);
    }

    private set keyDown(value: boolean) {
        if (value) {
            if (this.keyDownObs) {
                return;
            }

            let element = this.elementRef.nativeElement as HTMLElement;
            this.keyDownObs = Observable.fromEvent(element.ownerDocument, 'keydown').subscribe((event: KeyboardEvent) => {
                switch (event.keyCode) {
                    case KeyCodes.Escape:
                        if (this.closeOnEscape) {
                            this.hide.emit();
                        }
                        return false;
                    default:
                        return true;
                }
            });
        } else if (this.keyDownObs) {
            this.keyDownObs.unsubscribe();
            delete this.keyDownObs;
        }
    }
}
