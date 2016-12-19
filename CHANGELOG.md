<a name="1.1.0"></a>
# [1.1.0] (2016-12-09)

## Breaking Changes
* `DejaGridCellTemplateDirective` à été remplacée par ngTemplateOutlet. A l'utilisation, la déclaration de la ligne devient implicite.
  ```html
  <template #cellTemplate let-row let-column="column">
  </template>
  ```
* `ItemTemplateDirective` à été remplacée par ngTemplateOutlet. A l'utilisation, la déclaration de l'élément devient implicite.
  ```html
  <template #itemTemplate let-item>
  </template>
  ```

* `TileTemplateDirective` à été remplacée par ngTemplateOutlet. A l'utilisation, la déclaration de tile devient implicite.
  ```html
  <template #tileTemplate let-tile>
  </template>
  ```

* `TemplateDirective` à été supprimée, utiliser dorenavant ngTemplateOutlet. 

* `ItemListService` Le paramètre multiselect à été supprimé de la fonction toggleSelect. Surcharger les méthodes selectItem et unSelectItem à la place de toggleSelect.

* `DejaColorPickerComponent` selectedColor et colorchange ont été supprimé. Le composant implémente mainteant ngModel.

* `DejaColorSelectorComponent` selectedColor et colorchange ont été supprimé. Le composant implémente mainteant ngModel.

* `DejaColorSelect` delaySerachTrigger renomé en delaySearchTrigger


### Features

* Documentation des composants ajoutée.
* **ItemListService:** Une fonction selectItems à été ajoutée pour surcharger ou hooker la selection multiple.
* **ItemListService:** Une fonction selectItem à été ajoutée pour surcharger ou hooker la selection d'un élément.
* **ItemListService:** Une fonction unSelectItems à été ajoutée pour surcharger ou hooker la déselection multiple.
* **ItemListService:** Une fonction unSelectItem à été ajoutée pour surcharger ou hooker la déselection d'un élément.
* **ItemListService:** Une fonction expandItems à été ajoutée pour surcharger ou hooker l'extension multiple.
* **ItemListService:** Une fonction expandItem à été ajoutée pour surcharger ou hooker l'extension d'un élément.
* **ItemListService:** Une fonction collapseItems à été ajoutée pour surcharger ou hooker la fermeture multiple.
* **ItemListService:** Une fonction collapseItem à été ajoutée pour surcharger ou hooker la fermeture d'un élément.
* **ItemListService:** La liste des éléments selectionés est synchronisée avec la liste complète, même si les instances sont différentes. Pour cela, une methode equals a été ajoutée à IItemBase et doit être implémentée pour que la synchronisation ne se base pas sur les instances.
* **DejaColorPickerComponent:** Le composant implémente mainteant ngModel.
* **DejaColorSelectorComponent:** Le composant implémente mainteant ngModel.

### Bug Fixes




### Performance Improvements

* **ItemListService:** Amélioration de la gestion des caches.
