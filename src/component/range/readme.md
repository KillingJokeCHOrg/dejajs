# Range
Ce composant permet d'ajouter, supprimer et modifier des intervals.
La représentation de ce composant ressemble à celle d'un slider ayant de multiples séparateurs.

## Utilisation
### Sans template
```html
<deja-range [(ngModel)]="rangeValues"
    #dejaRange>
</deja-range>
```

### Avec template
Il est votre responsabilité d'implémenter la charte graphique en surchargeant les styles prédéfinis dans le composant si vous utiliser cette implémentation. Les styles qui peuvent être modifier par l'utilisateur sont explicitement spécifié en tant que tel. Les styles nécessaire au bon fonctionnement du composant ne doivent être modifié en aucun cas. Si vous devez le faire pour X raison il est votre responsabilité régler les problèmes qui découleront de cette pratique.
```html
<deja-range [(ngModel)]="rangeValues"
    [readOnly]="false"
    [selected]="0"
    [step]="0.5"
    #dejaRange>
   <template #rangeTemplate
        let-range
        let-index="index">

        <!-- Résentation graphique de l'interval ici, libre à l'utilisateur -->        
        <span class="range">{{range.min}} - {{range.max}}</span>

    </template>
    <template #separatorTemplate
        let-ranges
        let-range
        let-index="index">

        <!-- Résentation graphique du séparateur ici, libre à l'utilisateur -->
        <span class="separator">|</span>

    </template>
</deja-range>
```

## API
### Propriétés
<table>
    <tr>
        <th>Nom</th>
        <th>Obligatoire</th>
        <th>Type</th>
        <th>Genre</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ngModel</td>
        <td>oui</td>
        <td>IRange[]</td>
        <td>[(ngModel)]</td>
        <td>intervals passés au composant</td>
    </tr>
    <tr>
        <td>readOnly</td>
        <td>non</td>
        <td>boolean</td>
        <td>@Input()</td>
        <td>mode actuel du composant, édition ou consultation</td>
    </tr>
    <tr>
        <td>step</td>
        <td>non</td>
        <td>number</td>
        <td>@Input()</td>
        <td>interval entre les valeurs pour l'édition</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>non</td>
        <td>number</td>
        <td>@Input()</td>
        <td>index de l'interval séléctionné par défaut</td>
    </tr>
</table>

### Méthodes
<table>
    <tr>
        <th>Nom</th>
        <th>Paramètres</th>
        <th>Type de sortie</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>add</td>
        <td></td>
        <td>void</td>
        <td>découpe l'interval actuellement séléctionné en 2 nouveaux intervals</td>
    </tr>
    <tr>
        <td>remove</td>
        <td></td>
        <td>void</td>
        <td>supprime l'interval actuellement séléctionné</td>
    </tr>
</table>

### Evénements (@Output())
<table>
    <tr>
        <th>Nom</th>
        <th>Paramètres</th>
        <th>Obligatoire</th>        
        <th>Type de sortie</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>errorFeedback</td>
        <td>$event</td>
        <td>oui</td>
        <td>Error</td>
        <td>Si une erreur est produit, retourne l'erreur dans l'objet $event</td>
    </tr>
</table>

### Démonstration
Une démonstration est consultable dans l'application de démonstration.
