import { ElementRef, QueryList } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { clearTimeout, setTimeout } from 'timers';
import { GroupingService, IGroupInfo } from "../grouping/index";
import { ISortInfos, SortingService, SortOrder } from "../sorting/index";
import { IItemBase, IItemTree, IParentListInfoResult, ItemListService, IViewListResult } from "./index";

/** Classe de base pour tous les composants à listes (deja-treelist, deja-select, deja-grid) */
export class ItemListBase {
    protected _itemList: IItemBase[] = []; // Viewport list
    protected _multiSelect = false;
    protected _searchField: string;
    protected _textField: string;
    protected _currentItemIndex = -1;
    protected _hintLabel: string;
    protected _nodataLabel: string;
    protected waiter = false; // Display waiter
    protected computedMaxHeight = 0;
    protected _hideSelected: boolean;
    protected _childrenField: string;

    // Viewport
    protected _viewPortRowHeight = 33;
    protected vpBeforeHeight = 0;
    protected vpAfterHeight = 0;
    protected vpStartRow = 0;
    protected vpEndRow = 0;
    protected _pageSize = 0;
    protected _depthMax = 0;
    protected rowsCount = 0;

    // Sorting
    protected _sortInfos: ISortInfos;

    // Drag drop
    protected _ddStartIndex: number;
    protected _ddTargetIndex: number;

    private _itemListService: ItemListService;
    private allCollapsed = false;
    private toggleCollapseTimeout: NodeJS.Timer;

    /** Renvoie le modèle de tri appliqué à la liste.
     * @param {ISortInfos} sortInfos Modèle de tri appliqué.
     */
    public get sortInfos() {
        return this._sortInfos;
    }

    /** Renvoie le modèle de regroupement appliqué à la liste.
     * @param {IGroupInfos} sortInfos Modèle de regroupement appliqué.
     */
    public get groupInfos() {
        return this._itemListService.groupInfos;
    }

    /** Définit une valeur indiquant si les éléments selectionés doivent être masqué. Ce flag est principalement utilisé dans le cas d'un multi-select
     * @param {boolean} value True si les éléments selectionés doivent être masqués
     */
    public setHideSelected(value: boolean) {
        this._hideSelected = value;
        if (this._itemListService) {
            this._itemListService.hideSelected = value;
        }
    }

    /** Définit le champs utilisé comme collection pour les enfants d'un parent.
     * @param {string} value Nom du champ à utiliser comme collection d'enfants
     */
    public setChildrenField(value: string) {
        this._childrenField = value;
        if (this._itemListService) {
            this._itemListService.childrenField = value;
        }
    }

    /** Renvoie l'index de l'élément sur la liste plate corespondant à l'élément HTML spécifié
     * @return {number} Index sur la liste plate corespondant à l'élément HTML
     */
    public getItemIndexFromHTMLElement(element: HTMLElement): number {
        let parentElement = element && element.parentElement;

        while (parentElement && !parentElement.hasAttribute('ulist')) {
            element = parentElement;
            parentElement = parentElement.parentElement;
        }

        if (!parentElement) {
            return undefined;
        }

        return +element.getAttribute('flat');
    }

    /** Retourne le service de liste utilisé par ce composant.
     * @return {ItemListService} Service de liste utilisé par ce composant.
     */
    public getItemListService() {
        if (!this._itemListService) {
            this.setItemListService(new ItemListService());
        }
        return this._itemListService;
    }

    /** Retourne l'élément courant (actif).
     * @return {IItemBase} Elément courant.
     */
    public getCurrentItem() {
        return this._currentItemIndex >= 0 ? this.getItemListService().getItemFromIndex(this._currentItemIndex) : null;
    }

    /** Retourne la liste des éléments sélectionés.
     * @return {IItemBase[]} Liste des éléments selectionés.
     */
    public getSelectedItems() {
        return this.getItemListService().getSelectedItems();
    }

    /** Définit la liste des éléments sélectionés.
     * @param {IItemBase[]} items Liste des éléments a selectioner.
     */
    public setSelectedItems(value: IItemBase[]) {
        return this.getItemListService().setSelectedItems(value);
    }

    /** Evalue le texte à afficher pour l'élément spécifié.
     * @param {any} value  Model à évaluer.
     * @return {string} Texte à afficher pour le modèle spécifié.
     */
    public getTextValue(value: any) {
        return this.getItemListService().getTextValue(value, this._textField);
    }

    /** Trie la liste par le champs spécifié. */
    public sort(name?: string) {
        return new Promise<ISortInfos>((resolved?: (sortInfos: ISortInfos) => void, rejected?: (reason: any) => void) => {
            let sortField = name || this._textField;

            if (!this._sortInfos) {
                this._sortInfos = {
                    name: sortField,
                    order: SortOrder.ascending,
                };
            } else if (sortField === this._sortInfos.name) {
                this._sortInfos.order = this._sortInfos.order === SortOrder.ascending ? SortOrder.descending : SortOrder.ascending;
            } else {
                this._sortInfos.name = sortField;
                this._sortInfos.order = SortOrder.ascending;
            }
            return this.getItemListService().sort(this._sortInfos).then((si) => {
                this.calcViewPort().then(() => {
                    resolved(si);
                }).catch(rejected);
            }).catch(rejected);
        });
    }

    /** Groupe les éléments en fonction du modèle de groupe spécifié
     * @param {IGroupInfo} groupInfos Modèle de groupe à appliquer.
     * @return {Promise} Promesse résolue par la fonction.
     */
    public group(groups: IGroupInfo[]) {
        return new Promise<IGroupInfo[]>((resolved?: (groupInfos: IGroupInfo[]) => void, rejected?: (reason: any) => void) => {
            return this.getItemListService().group(groups).then((ginfos) => {
                this.calcViewPort().then(() => {
                    resolved(ginfos);
                }).catch(rejected);
            }).catch(rejected);
        });
    }

    /** Retire les groupe correspondants au modèle de groupe spécifié
     * @param {IGroupInfo} groupInfos Modèle de groupe à retirer.
     * @return {Promise} Promesse résolue par la fonction.
     */
    public ungroup(groupInfo: IGroupInfo) {
        return new Promise<IGroupInfo[]>((resolved?: (groupInfos: IGroupInfo[]) => void, rejected?: (reason: any) => void) => {
            return this.getItemListService().ungroup(groupInfo).then((ginfos) => {
                this.calcViewPort().then(() => {
                    resolved(this.groupInfos);
                }).catch(rejected);
            }).catch(rejected);
        });
    }


    /** Change l'état d'expansion de tous les éléments.
     * @return {Promise} Promesse résolue par la fonction.
     */
    public toggleAll() {
        return new Promise<void>((resolved?: () => void, rejected?: (reason: any) => void) => {
            this.allCollapsed = !this.allCollapsed;
            if (this._viewPortRowHeight === 0) {
                this._itemList.forEach((item, index) => {
                    let treeItem = item as IItemTree;
                    if (treeItem.$items && treeItem.depth === 0 && treeItem.collapsible !== false) {
                        this.toggleCollapse(index + this.vpStartRow, this.allCollapsed).then(resolved).catch(rejected);
                    }
                });
            } else {
                this.getItemListService().toggleAll(this.allCollapsed).then(resolved).catch(rejected);
            }
        });
    }

    /** Change l'état d'expansion de l'élément spécifié par son index sur la liste des éléments visibles.
     * @param {number} index  Index sur la liste des éléments visibles de l'élément à changer.
     * @param {boolean} collapse  Etat de l'élément. True pour réduire l'élément.
     * @return {Promise} Promesse résolue par la fonction.
     */
    public toggleCollapse(index: number, collapsed: boolean): Promise<boolean> {
        return new Promise<boolean>((resolved?: (value: boolean) => void, rejected?: (reason: any) => void) => {
            if (this.toggleCollapseTimeout) {
                clearTimeout(this.toggleCollapseTimeout);
                this.toggleCollapseTimeout = undefined;
            }

            // return this.getItemListService().toggleCollapse(index, this._childrenField, collapsed);

            // Get item with relative index
            let item = this._itemList[index - this.vpStartRow];
            if (!item) {
                // Not on the visible part, no transition
                this.getItemListService().toggleCollapse(index, collapsed).then((result) => {
                    resolved(result);
                }).catch((reason) => {
                    rejected(reason);
                });
                return;
            }

            let oldlist = [...this._itemList];
            let oldTreeInfo = this.getItemTreeInfo(oldlist, item);

            if (this._viewPortRowHeight === 0) {
                if (collapsed) {
                    // Hide children for effect
                    let children = (oldTreeInfo.children || []) as IItemTree[];
                    children.forEach((child) => child.expanding = true);

                    setTimeout(() => {
                        children.forEach((child) => child.expanding = false);
                        this.getItemListService().toggleCollapse(index, collapsed).then((result) => {
                            if (!this.toggleCollapseTimeout) {
                                delete this.toggleCollapseTimeout;
                                this.calcViewPort().then(() => {
                                    resolved(result);
                                });
                            }
                        }).catch((reason) => {
                            rejected(reason);
                        });
                    }, 300);

                } else {
                    this.getItemListService().toggleCollapse(index, collapsed).then((result) => {
                        this.calcViewPort().then((vpresult) => {
                            let newTreeInfo = this.getItemTreeInfo(vpresult.visibleList, item);

                            // Hide children for effect
                            let children = (newTreeInfo.children || []) as IItemTree[];
                            children.forEach((child) => child.collapsing = true);

                            setTimeout(() => {
                                // Show children now for effect
                                children.forEach((child) => child.collapsing = false);
                            }, 0);

                            this.toggleCollapseTimeout = setTimeout(() => {
                                delete this.toggleCollapseTimeout;
                                this.calcViewPort().then(() => {
                                    resolved(result);
                                });
                            }, 300);
                        });
                    }).catch((reason) => {
                        rejected(reason);
                    });
                }
            } else {
                this.getItemListService().toggleCollapse(index, collapsed).then((result) => {
                    this.calcViewPort().then((vpresult) => {
                        let newlist = vpresult.visibleList;
                        let newTreeInfo = this.getItemTreeInfo(newlist, item);

                        if (!collapsed) {
                            // Add elements to the flat list, expand and calc new flatlist, keep children hidden for effect
                            let children = (newTreeInfo.children || []) as IItemTree[];
                            children.forEach((child) => child.expanding = true);

                            // Calc added elements, start index still the same
                            let oldEndRow = Math.min(oldlist.length - 1, this.vpEndRow - this.vpStartRow);
                            let newEndRow = Math.min(newlist.length - 1, newTreeInfo.lastIndex + 1);

                            // Create a temporary list for visual effect
                            this._itemList = [...newlist.slice(0, newEndRow), ...oldlist.slice(oldTreeInfo.startIndex + 1, oldEndRow)];

                            setTimeout(() => {
                                // Show children now for effect
                                children.forEach((child) => child.expanding = false);
                            }, 0);

                            // Recalc viewport after transition
                            this.toggleCollapseTimeout = setTimeout(() => {
                                delete this.toggleCollapseTimeout;
                                this.calcViewPort().then(() => {
                                    resolved(result);
                                });
                            }, 400);

                        } else {
                            // Remove elements from the flat list, collapse and calc new flatlist
                            // Add same amount of elements to the visible list
                            let oldEndRow = Math.min(oldlist.length - 1, oldTreeInfo.lastIndex + 1);
                            this.vpEndRow = Math.min(newlist.length - 1, this.vpEndRow - this.vpStartRow);
                            this._itemList = [...oldlist.slice(0, oldEndRow), ...newlist.slice(newTreeInfo.startIndex + 1)];
                            this.calcViewPort().then(() => {
                                resolved(result);
                            });
                        }
                    });
                }).catch((reason) => {
                    rejected(reason);
                });
            }
        });
    }

    /** Déselectionne tous les éléments sélectionés.
     * @return {Promise} Promesse résolue par la fonction.
     */
    public unselectAll() {
        let itemListService = this.getItemListService();
        return itemListService.unselectAll();
    }

    /** Nettoye les caches et réaffiche le viewport. */
    public refresh() {
        this.getItemListService().invalidateCache();
        this.calcViewPort();
    }

    /** Efface le viewport */
    public clearViewPort() {
        this.vpBeforeHeight = 0;
        this.vpAfterHeight = 0;
        this._itemList = [];
    };

    /** Retrouve les informations du parent de l'élément spécifié
     * @param {IItemTree} item Element enfant du parent à retrouver.
     * @return {Promise<IParentListInfoResult>} Promesse résolue par la fonction, qui retourne les informations sur le parent de l'élément spécifié
     */
    public getParentListInfos(item: IItemTree): Promise<IParentListInfoResult> {
        return this.getItemListService().getParentListInfos(item);
    }

    /** Trouve l'élément suivant répondant à la fonction de comparaison spécifiée.
     * @param {Function} compare Function de comparaison pour la recherche de l'élément.
     * @param {number} startIndex Index de départ sur la liste des éléments visibles.
     * @return {Promise} Promesse résolue par la fonction.
     */
    protected findNextMatch(compare?: (item: IItemBase, index: number) => boolean, startIndex?: number) {
        return this.getItemListService().findNextMatch(compare, startIndex);
    }

    /** Définit la hauteur d'une ligne pour le calcul du viewport. Le Viewport ne fonctionne qu'avec des hauteurs de lignes fixe.
     * Pour désactiver le viewport, mettre la hauteur de ligne à 0.
     * Attention, une désactivation du viewport dégrade considérablement les performances de la liste et ne doit pas être activée si la liste
     * est suceptible de contenir beaucoup d'éléments.
     * @param {number} value Hauteur de ligne à utiliser pour le calcul du viewport.
     */
    protected setViewPortRowHeight(value: number) {
        this._viewPortRowHeight = value;
    }

    /** Definit le service de liste utilisé par ce composant.
     * @param {ItemListService} value Service de liste utilisé par ce composant.
     */
    protected setItemListService(value: ItemListService) {
        this._itemListService = value;
        if (this._itemListService) {
            this._itemListService.hideSelected = this._hideSelected;
            this._itemListService.childrenField = this._childrenField;
        }
    }

    /** Definit le service de tri utilisé par ce composant.
     * @param {SortingService} value Service de tri utilisé par ce composant.
     */
    protected setSortingService(value: SortingService) {
        if (!value && !this._itemListService) {
            return;
        }
        this._itemListService.setSortingService(value);
    }

    /** Definit le service de regroupement utilisé par ce composant.
     * @param {GroupingService} value Service de regroupement utilisé par ce composant.
     */
    protected setGroupingService(value: GroupingService) {
        if (!value && !this._itemListService) {
            return;
        }
        this._itemListService.setGroupingService(value);
    }

    /** Définit le texte à afficher dans la zone de conseil.
     * @param {string} value Texte à afficher.
     */
    protected setHintLabel(value: string) {
        this._hintLabel = value;
    }

    /** Définit le texte à afficher si la liste est vide.
     * @param {string} value Texte à afficher.
     */
    protected setNodataLabel(value: string) {
        this._nodataLabel = value;
    }

    /** Définit l'élément courant (actif).
     * @param {IItemBase} item Elément courant.
     */
    protected setCurrentItem(item: IItemBase) {
        this._currentItemIndex = item ? this.getItemListService().getItemIndex(item) : -1;
    }

    /** Retourne l'index correspondant à l'élément spéficié dans la liste des éléments visibles
     * @param {IItemBase} item Element à chercher sur la liste des éléments visibles.
     * @return {number} Index correspondant à l'élément recherché.
     */
    protected getItemIndex(item: IItemBase) {
        return item && this.getItemListService() ? this.getItemListService().getItemIndex(item) : -1;
    }

    /** Définit si plusieurs éléments peuvent être sélectionés.
     * @param {boolean} value True si plusieurs éléments peuvent être sélectionés.
     */
    protected setMultiSelect(value: boolean) {
        this._multiSelect = value;
    }

    /** Définit le modèle utilisé par la liste. Ce model peut ètre hierarchique sans limitation de la profondeur ou une chargé en asynchrone par une promise ou un observable.
     * @param {GroupingService}items Provider de la liste des éléments de la liste.
     */
    protected setItems(items: IItemBase[] | Promise<IItemBase[]> | Observable<IItemBase[]>) {
        return this.getItemListService().setItems(items);
    }

    // Ne pas utiliser, cette fonction retourne la liste des éléments pour l'implémentation de ngModel.
    protected getItems() {
        return this.getItemListService().getItems();
    }

    /** Usage interne. Termine le drag and drop en cours. */
    protected drop() {
        this._currentItemIndex = -1;
        return this.getItemListService().drop();
    }

    /** Usage interne. Retourne la portion de la liste à afficher en fonction des paramètres spécifiés. */
    protected getViewList(query?: RegExp | string, startRow?: number, maxCount?: number, ignoreCache?: boolean): Promise<IViewListResult> {
        return this.getItemListService().getViewList(this._searchField || this._textField, query, startRow, maxCount, ignoreCache, this._ddStartIndex, this._ddTargetIndex);
    }

    /** Sélectionne une plage d'éléments en fonction de l'index de début et l'index de fin sur la liste des éléments visibles.
     * @param {number} indexFrom index sur la liste des éléments visibles du premier élément à sélectioner.
     * @param {number} indexTo index sur la liste des éléments visibles du dernier élément à sélectioner.
     * @return {Promise} Promesse résolue par la fonction.
     */
    protected selectRange(indexFrom: number, indexTo?: number) {
        let itemListService = this.getItemListService();
        return itemListService.selectRange(indexFrom, indexTo);
    }

    /** Change l'état de selection de l'élément spécifié.
     * @param {IItemBase[]} items Liste des éléments à modifier.
     * @param {boolean} selected True si les éléments divent être sélectionés, False si ils doivent être déselectionés.
     * @return {Promise} Promesse résolue par la fonction.
     */
    protected toggleSelect(items: IItemBase[], selected: boolean) {
        let itemListService = this.getItemListService();
        return itemListService.toggleSelect(items, selected);
    }

    /** Définit si l'élément spécifié peut être réduit.
     * @param {IItemTree} item Elément à analyser.
     * @return {boolean} True si l'élément peut être réduit.
     */
    protected isCollapsible(item: IItemTree) {
        return item && item.$items && item.collapsible !== false;
    }

    /** Définit si l'élément spécifié est selectionable.
     * @param {IItemBase} item Elément à analyser.
     * @return {boolean} True si l'élément est selectionable.
     */
    protected isSelectable(item: IItemBase) {
        return item && item.selectable !== false;
    }

    /** Définit le champ à utiliser comme valeur d'affichage.
     * @param {string} value Champ à utiliser comme valeur d'affichage.
     */
    protected setTextField(value: string) {
        this._textField = value;
    }

    /** Définit le champ à utiliser comme champ de recherche.
     * Ce champ peut indiquer, un champ contenant une valeur, un texte indexé, ou une fonction.
     * @param {string} value Champ à utiliser comme champ de recherche.
     */
    protected setSearchField(value: string) {
        this._searchField = value;
    }

    /** Internal usage. Calc the best target when an item is drag and dropped */
    protected calcDragTargetIndex(index: number, targetIndex: number) {
        return this.getItemListService().calcDragTargetIndex(index, targetIndex);
    }

    /** Internal usage */
    protected getItemTreeInfo(items: IItemBase[], item: IItemBase): IItemTreeInfo {
        let parentIndex = items.findIndex((itm) => itm === item);
        if (parentIndex < 0) {
            return null;
        }

        let treeItem = item as IItemTree;
        let parentDepth = treeItem.depth;
        let lastIndex = parentIndex;
        let children = [] as IItemBase[];

        if (parentDepth !== undefined) {
            for (let i = parentIndex + 1; i < items.length; i++) {
                let currentItem = items[i] as IItemTree;
                if (currentItem.depth <= parentDepth) {
                    break;
                }
                children.push(currentItem);
                lastIndex = i;
            }
        }

        return {
            children: children,
            item: item,
            lastIndex: lastIndex,
            startIndex: parentIndex,
        } as IItemTreeInfo;
    }

    /** Charge le viewport */
    protected loadViewPort(res: IViewListResult) {
        return new Promise<IViewListResult>((resolved?: (value: IViewListResult) => void, rejected?: (reason: any) => void) => {
            this._itemList = res.visibleList;
            this.vpStartRow = res.startRow;
            this.vpEndRow = res.endRow;
            this.rowsCount = res.rowsCount;
            this.vpBeforeHeight = this.vpStartRow * this._viewPortRowHeight;
            this.vpAfterHeight = (this.rowsCount - 1 - this.vpEndRow) * this._viewPortRowHeight;
            if (res.depthMax !== undefined) {
                this._depthMax = res.depthMax;
            }
            resolved(res);
        });
    }

    /** Calcule le viewport pour le conteneur spécifié. */
    protected calcViewPort(query?: string, maxHeight?: number, containerElement?: HTMLElement, ignoreSelection?: boolean) {
        return new Promise<IViewListResult>((resolved?: (value: IViewListResult) => void, rejected?: (reason: any) => void) => {
            let loadViewPort = (viewList: Promise<IViewListResult>) => {
                if (viewList) {
                    this.waiter = true;
                    delete this._hintLabel;
                    viewList.then((response) => {
                        this.loadViewPort(response).then((res: IViewListResult) => {
                            this.waiter = false;
                            resolved(res);
                        });
                    }).catch((error) => {
                        this._hintLabel = error;
                        this.waiter = false;
                        this.clearViewPort();
                        rejected(error);
                    });
                } else {
                    this.clearViewPort();
                    resolved(null);
                }
            };

            let containerHeight = this.computedMaxHeight || maxHeight || containerElement.clientHeight;
            // TODO -> default view port row height
            if (containerHeight <= this._viewPortRowHeight) {
                // Set the viewlist to the maximum haight to measure the real max-height defined in the css
                maxHeight = 200000;
                // Use a blank div to do that
                this.vpAfterHeight = maxHeight;
                // Wait next life cycle for the result
                setTimeout(() => {
                    this.computedMaxHeight = containerElement.clientHeight;
                    this.calcViewPort(query, this.computedMaxHeight, containerElement);
                }, 0);
            } else {
            if (this._viewPortRowHeight === 0) {
                    let visibleList = this.getViewList(query);
                    // Calculer ces valeurs
                this.vpBeforeHeight = 0;
                this.vpAfterHeight = 0;
                    // Restreindre cette liste
                    let viewList = visibleList;
                    loadViewPort(viewList);


            } else {
                    let loadViewList = () => {
                    let scrollPos = containerHeight ? containerElement.scrollTop : 0;
                    let maxCount = Math.ceil(containerHeight / this._viewPortRowHeight);
                    let startRow = Math.floor(scrollPos / this._viewPortRowHeight);

                    if (maxCount) {
                        maxCount++;
                    }

                    loadViewPort(this.getViewList(query, startRow, maxCount));
                };

                    loadViewList();
                }
            }
        });
    }

    /** Calcul la position de la scrollbar pour que l'élément spéfié soit dans la zone visible. */
    protected ensureItemVisible(containerElement: HTMLElement, listItemElements: QueryList<ElementRef>, item: IItemBase | number) {
        if (item !== undefined) {
            let index = item as number;
            if (isNaN(index)) {
                index = this._itemList.findIndex((itm) => item === itm);
            }

            if (this._viewPortRowHeight === 0) {
                if (index >= 0) {
                    let element = index >= 0 && listItemElements.toArray()[index];
                    if (element) {
                        element.nativeElement.scrollIntoViewIfNeeded();
                    }
                }
            } else {
                // View port constant row height
                let index = item as number;
                if (isNaN(index)) {
                    index = this._itemList.findIndex((itm) => item === itm) + this.vpStartRow;
                }

                if (index < 0) {
                    // Outside visible part, ask service
                    index = this.getItemIndex(item as IItemBase);
                }

                if (index >= 0) {
                    let scrollPos = containerElement.scrollTop;
                    let scrollMax = index * this._viewPortRowHeight;
                    if (scrollPos > scrollMax) {
                        containerElement.scrollTop = scrollMax;
                    } else {
                        let scrollMin = scrollMax - containerElement.clientHeight + this._viewPortRowHeight;
                        if (scrollPos < scrollMin) {
                            containerElement.scrollTop = scrollMin;
                        }
                    }
                }
            }
        }
    }
}

export interface IItemTreeInfo {
    item?: IItemBase;
    children?: IItemBase[];
    startIndex: number;
    lastIndex?: number;
};
