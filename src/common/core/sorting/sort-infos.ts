/** Ordres de tri possibles */
export enum SortOrder { 
    /** Ascendant */
    ascending,
    /** Descendant */
    descending,
}

/** Model de tri pour le SortingService */
export interface ISortInfos { 
    /* Nom du champ par lequel effectuer le tri ou fonction renvoyant le nom du champ */
    name?: ((model: any) => string) | string;
    /* Ordre de tri */
    order?: SortOrder;
    /* Type de la donée de tri ('number', 'string', 'date') */
    type?: string; 
}
