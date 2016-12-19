/**
 * Annotation Factory that allows HTML style boolean attributes. For example,
 * a field declared like this:
 * @Directive({ selector: 'component' }) class MyComponent {
 *   @Input() @BooleanFieldValue() myField: boolean;
 * }
 *
 * You could set it up this way:
 *   <component myField>
 * or:
 *   <component myField="">
 */
let booleanFieldValueFactory = () => {
    return (target: any, key: string) => {
        const defaultValue = target[key];
        const localKey = `__deja_private_symbol_${key}`;
        target[localKey] = defaultValue;

        Object.defineProperty(target, key, {
            get() {
                return this[localKey];
            },
            set(value: boolean) {
                this[localKey] = value != null && `${value}` !== 'false';
            },
        });
    };
};

export { booleanFieldValueFactory as BooleanFieldValue };
