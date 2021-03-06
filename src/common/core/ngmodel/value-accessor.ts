import { ControlValueAccessor } from "@angular/forms";

const noopv = (v: any) => { };
const noop = () => { };

export abstract class ValueAccessor implements ControlValueAccessor {

    protected onChangeCallback: (v: any) => void = noopv;
    protected onTouchedCallback: () => void = noop;
    protected model: any;

    // ************* ControlValueAccessor Implementation **************

    // From ControlValueAccessor interface
    public writeValue(v: any) {
        if (v !== this.model) {
            this.model = v;
        }
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
}
