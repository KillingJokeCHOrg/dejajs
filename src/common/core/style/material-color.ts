import { Color } from "../graphics/color";
import { MaterialColors } from "../index";

export class MaterialColor extends Color {
    public static fromText(text: string) {
        let sum = 0;
        for (let i = 0; i < text.length; i++) {
            sum += text.charCodeAt(i);
        }
        let colors = new MaterialColors().colors;
        let subColors = (colors[sum % colors.length]).subColors;
        return subColors[sum % subColors.length];
    }

    public name: string;
    public subColors = [] as MaterialColor[];
}
