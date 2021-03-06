// Attention, spécifier ici que les messages génériques. Créez votre propre objet pour les messages spécifiques à votre page
export class ValidationMessages {
    private messages = {
        duplicatename: 'Ce nom existe déjà.',
        invalideDate: 'Date invalide',
        required: 'Ce champ est obligatoire.',
    };

    public getMessage(key: string) {
        return this.messages[key];
    }
};
