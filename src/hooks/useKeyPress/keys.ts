export const enum KEYS_VALUE {
    DOWN = 0,
    UP = 1,
    LEFT = 2,
    RIGHT = 3,
    ENTER = 4,
    BACK = 90,
    HOME = 91
};


export interface IKEY_MAP {
    code:KEYS_VALUE,
    keys:Array<String>
}


export interface IUseKeyPress {
    onKeyPressed?(key:(KEYS_VALUE | null | undefined)):void
    onKeyUp?(key:(KEYS_VALUE | null | undefined)):void
}

export const KEYS_MAP:Array<IKEY_MAP>= [
    {code:KEYS_VALUE.DOWN, keys:['Down','ArrowDown']},
    {code:KEYS_VALUE.UP, keys:['Up','ArrowUp']},
    {code:KEYS_VALUE.LEFT, keys:['Left','ArrowLeft']},
    {code:KEYS_VALUE.RIGHT, keys:['Right','ArrowRight']},
    {code:KEYS_VALUE.ENTER, keys:['Enter']},
    {code:KEYS_VALUE.BACK, keys:['Esc','Escape']},
]