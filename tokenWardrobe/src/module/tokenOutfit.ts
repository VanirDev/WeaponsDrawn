export interface TokenImage {
    scale: number,
    path: string,
}

export interface TokenOutfit {
    name: string,
    default: boolean,
    passive: TokenImage,
    combat: TokenImage | undefined
}