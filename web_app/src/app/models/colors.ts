
export interface ColorClass {

    id: number;
    name: string;
    description: string;
    max_saturation: number;
    max_hue: number;
    max_lightness: number;
    people: number;

}

export interface RGB {
    r: number, g: number, b: number
}

export interface HSL {
    h: number, s: number, l: number
}