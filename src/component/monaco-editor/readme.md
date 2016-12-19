# Monaco Editor
Monaco Editor est l'éditeur de code utilisé dans [VS Code](https://github.com/Microsoft/vscode).
Une page décrivant bien les fonctionnalitées de l'éditeur est présente [ici](https://code.visualstudio.com/docs/editor/editingevolved).

### Utilisation 
> Ne pas oublier d'importer le `DejaMonacoEditorModule`dans les `imports` de votre module concerné !

```html
<deja-monaco-editor [(value)]="code" [(valueToCompare)]="codeToCompare" [language]="language"></deja-monaco-editor>
```

```typescript
export class DejaMonacoEditorDemo implements OnInit {
    protected code: string;

    protected language: IEditorLanguage = IEditorLanguage.XML;
    protected languageJson: IEditorLanguage = IEditorLanguage.JSON;

    constructor() {
    }

    public ngOnInit() {
		this.code = `<GROUP ID="GROUP_PROBE_UPSRV">
        <LABEL><![CDATA[UserProfile]]></LABEL>
        <TAG>up upsrv</TAG>
        <PROBE ID="HUGLOG_SLOW_COMPONENT_UPSRV"/>
        <PROBE ID="HUGLOG_ERROR_COMPONENT_UPSRV"/>
        <PROBE ID="HUGLOG_UPSERVER_SQL_PERF"/>
        <PROBE ID="PERF_DATABASE_UPSRV"/>
        <PROBE ID="PING_DATABASE_UPSRV"/>
        <PROBE ID="HUGLOG_PROBLEM_WITH_SERVER_COMPONENT_UPSRV"/>
        <JAVACODE>
            <![CDATA[
			]]>
        </JAVACODE>
    </GROUP>`
    }
}
```

### Propriétés

<table>
<tr>
    <th>Nom</th>
    <th>Obligatoire</th>
    <th>Type</th>
    <th>Description</th>
</tr>
<tr>
    <td>value</td>
    <td>Oui</td>
    <td>string</td>
    <td>Contenu a afficher dans l'éditeur</td>
</tr>
<tr>
    <td>valueToCompare</td>
    <td>Non</td>    
    <td>string</td>
    <td>Contenu a comparer avec "value" dans l'éditeur</td>
</tr>
<tr>
    <td>language</td>
    <td>Oui</td>    
    <td>IEditorLanguage</td>
    <td>Langage du code affiché (Voir la liste des langages supportés)</td>
</tr>
<tr>
    <td>disableAutocomplete</td>
    <td>Non</td>
    <td>Boolean</td>
    <td>Désactive le parsing du contenu afin d'afficher une autompletion mise à jour a chaque fois que l'utilisateur saise Ctrl + Espace</td>
</tr>
<tr>
    <td>valueChange</td>
    <td>Non</td>
    <td>Event</td>
    <td>Exécuté lors d'une modification de la valeur de "value"</td>
</tr>
<tr>
    <td>valueToCompareChange</td>
    <td>No</td>
    <td>Event</td>
    <td>Exécuté lors d'une modification de la valeur de "valueToCompare"</td>
</tr>
<tr>
    <td>nodeModulePath</td>
    <td>'node_modules' (Par défaut à la racine)</td>
    <td>String</td>
    <td>Chemin absolu vers le dossier node_modules. Permet de modifier le path du dossier node module si celui-ci n'est pas à la racine. Ex: Si votre dossier node_module est dans un sous dossier "mon-app", il faut saisir : 'mon-app/node_modules'. Cela indique au composant de charger la lib dans http://MONSERVER:PORT/mon-app/node_modules/monaco-editor/min/vs/loader.js</td>
</tr>
</table>

Il est également possible de passer au composant l'ensemble des options disponible au composant Monaco ([voir ici](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html#readonly))
```html
<deja-monaco-editor [(value)]="code" [language]="language" [readOnly]="true" [automaticLayout]="true"></deja-monaco-editor>
```

### Langages supportés
La liste des langages disponible est accessible au travers de l'interface IEditorLanguage.
```typescript
    protected language: IEditorLanguage = IEditorLanguage.XML;
```

### Demonstration
A demonstration is available in the Demo App.