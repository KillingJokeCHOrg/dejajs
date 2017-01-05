<a name="0.0.1-beta4"></a>
# [0.0.1-beta4] (2017-01-05)

### Breaking changes from 1.0.0
* **DejaAutosizeTextAreaDirective:** The directive deja-autositze is now placed on the textarea element inside an md-input-container. ngModel must be also declared on the textarea element.
* **BooleanFieldValue:**  The annotation BooleanFieldValue is removed due to an incompatibility with webpack. Now the angular material core coerceBooleanProperty is used instead.

### Bug Fixes
* Select searchFiled issue when searchField was a function.

### Features
* **ItemListService:** Updated to @angular/material 2.0.0-beta.1, look at the breaking changes of angular material in https://github.com/angular/material2/blob/master/CHANGELOG.md

<a name="0.0.1-beta3"></a>
# [0.0.1-beta3] (2016-12-20)

First commit
