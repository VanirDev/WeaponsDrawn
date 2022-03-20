export interface TokenImage {
    scale: number,
    path: string,
    horizontallyMirrored: boolean,
    verticallyMirrored: boolean
}

export interface TokenOutfit {
    name: string,
    default: boolean,
    passive: TokenImage,
    combat: TokenImage | undefined
}