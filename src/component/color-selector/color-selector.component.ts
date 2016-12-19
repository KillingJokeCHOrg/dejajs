import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable, Subscription } from 'rxjs/Rx';
import { clearTimeout, setTimeout } from 'timers';
import { BooleanFieldValue } from '../../common/core/annotations';
import { Color, ColorEvent } from '../../common/core/graphics/index';
import { MaterialColor } from '../../common/core/style';

const noop = () => { };

const ColorSelectorComponentAccessor = {
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DejaColorSelectorComponent),
};

/** Composant de selection d'une couleur. */
@Component({
    providers: [
        ColorSelectorComponentAccessor,
    ],
    selector: 'deja-color-selector',
    styleUrls: [
        './color-selector.component.scss',
    ],
    templateUrl: './color-selector.component.html',
})
export class DejaColorSelectorComponent implements ControlValueAccessor {
    /** Retourne ou definit si le selecteur est desactivé. */
    @Input() @BooleanFieldValue() public disabled: boolean = false;

    /** Evénement déclenché lorsqu'une couleur est survolée par la souris. */
    @Output() public colorhover = new EventEmitter();

    protected onTouchedCallback: () => void = noop;
    protected onChangeCallback: (_: any) => void = noop;

    private _colors: MaterialColor[];
    private _selectBaseIndex: number;
    private hoveredBaseIndex: number;
    private hoveredColor = false;
    private _selectVarIndex: number;
    private _value: Color;
    private colorAttribute = 'color';
    private indexAttribute = 'index';
    private varActive = true;
    private _subColors: Color[];
    private subBaseColorsIndex: number;
    private moveTimeout: NodeJS.Timer;
    private moveTarget: HTMLElement;
    private mouseMoveObs: Subscription;

    constructor(private elementRef: ElementRef) {
    }

    /**
     * Definit les couleurs selectionables affichées.
     *
     * @param colors    Structure hierarchique des couleurs selectionablea suivant le modele MaterialColor.
     */
    @Input() public set colors(colors: MaterialColor[]) {
        this._colors = colors;
        this._selectBaseIndex = undefined;
        this._selectVarIndex = undefined;
    }

    /**
     * Retourne les couleurs selectionables affichées.
     *
     * @return  Structure hierarchique des couleurs selectionablea suivant le modele MaterialColor.
     */
    public get colors() {
        return this._colors;
    }

    protected get subColors() {
        let baseindex = this.hoveredBaseIndex !== undefined ? this.hoveredBaseIndex : this.selectBaseIndex || 0;
        if (baseindex !== this.subBaseColorsIndex) {
            this.varActive = false;
            setTimeout(() => {
                this.subBaseColorsIndex = baseindex;
                this._subColors = this.colors[baseindex].subColors;
                setTimeout(() => {
                    this.varActive = true;
                }, 200);
            }, 100);
        }

        return this._subColors;
    }

    protected set subColors(value: Color[]) {
        this._subColors = value;
    }

    protected get selectBaseIndex() {
        if (this._selectBaseIndex === undefined) {
            this.calcSelectedIndexes();
        }
        return this._selectBaseIndex;
    }

    protected set selectBaseIndex(index: number) {
        this._selectBaseIndex = index;
        this._selectVarIndex = undefined;
    }

    protected get selectVarIndex() {
        if (this.hoveredBaseIndex !== undefined && this.hoveredBaseIndex !== this.selectBaseIndex) {
            return undefined;
        }

        if (this._selectVarIndex === undefined) {
            this.calcSelectedIndexes();
        }

        return this._selectVarIndex;
    }

    protected set selectVarIndex(index: number) {
        this._selectVarIndex = index;
    }

    // ************* ControlValueAccessor Implementation **************
    // set accessor including call the onchange callback
    public set value(value: any) {
        if (!Color.equals(value, this._value)) {
            this.writeValue(value);
            this.onChangeCallback(value);
        }
    }

    // get accessor
    public get value(): any {
        return this._value;
    }

    // From ControlValueAccessor interface
    public writeValue(value: any) {
        this._value = value;
        this.calcSelectedIndexes();
    }

    // From ControlValueAccessor interface
    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    // ************* End of ControlValueAccessor Implementation **************

    @HostListener('mouseenter', ['$event'])
    protected onMouseEnter(e: Event) {
        if (this.disabled) {
            return true;
        }

        // Enable mouse observer
        this.mouseMove = true;
    }

    @HostListener('mouseleave', ['$event'])
    protected onMouseLeave(e: Event) {
        this.restoreOriginalColor(e);

        // Remove mouse observer
        this.mouseMove = false;
    }

    @HostListener('click', ['$event'])
    protected onClick(e: Event) {
        if (this.disabled) {
            return;
        }

        let target = e.target as HTMLElement;
        if (target.id === 'basecolor' || target.id === 'subcolor') {
            this.hoveredColor = false;
            this.hoveredBaseIndex = undefined;
            this.value = Color.fromHex(target.attributes[this.colorAttribute].value);
            this.clearMoveTimeout();
        }
    }

    private set mouseMove(value: boolean) {
        let elem = this.elementRef.nativeElement as HTMLElement;
        if (value && !this.disabled) {
            if (this.mouseMoveObs) {
                return;
            }

            this.mouseMoveObs = Observable.fromEvent(elem, 'mousemove').subscribe((e: MouseEvent) => {
                if (this.disabled) {
                    this.mouseMove = false;
                    return;
                }

                if (this.moveTarget === e.target) {
                    return;
                }

                this.clearMoveTimeout();

                this.moveTarget = (e.target as HTMLElement);
                let targetid = this.moveTarget.id;
                let targetColor = this.moveTarget.attributes[this.colorAttribute] as any;
                let targetIndex = this.moveTarget.attributes[this.indexAttribute] as any;
                this.moveTimeout = setTimeout(() => {
                    this.moveTimeout = undefined;
                    if (targetid === 'basecolor' || targetid === 'subcolor') {
                        if (targetid === 'basecolor') {
                            // Select the current color temporary
                            this.hoveredBaseIndex = +targetIndex.value;
                        }
                        this.hoveredColor = true;
                        let event = new ColorEvent(e);
                        event.initColorEvent('colorevent', true, false, Color.fromHex(targetColor.value));
                        this.colorhover.emit(event);
                    } else {
                        this.restoreOriginalColor(e);
                    }
                }, targetid === 'subcolor' ? 10 : (targetid === 'basecolor' ? 350 : 1000));
            });
        } else if (this.mouseMoveObs) {
            this.mouseMoveObs.unsubscribe();
            delete this.mouseMoveObs;
        }
    }

    private restoreOriginalColor(e: Event) {
        this.clearMoveTimeout();
        if (this.hoveredColor) {
            // Reset the temporary color
            this.hoveredColor = false;
            this.hoveredBaseIndex = undefined;
            let event = new ColorEvent(e);
            event.initColorEvent('colorevent', true, false, undefined);
            this.colorhover.emit(event);
        }
    }

    private clearMoveTimeout() {
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
            this.moveTimeout = undefined;
        }
    }

    private calcSelectedIndexes() {
        this._selectBaseIndex = undefined;
        this._selectVarIndex = undefined;
        if (this._value) {
            for (let b = 0; b < this.colors.length; b++) {
                let baseColor = this.colors[b];
                for (let s = 0; s < baseColor.subColors.length; s++) {
                    let subColor = baseColor.subColors[s];
                    if (Color.equals(subColor, this._value)) {
                        this._selectBaseIndex = b;
                        this._selectVarIndex = s;
                        return;
                    }
                }
            }
        }
    }
}
