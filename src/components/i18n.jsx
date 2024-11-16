import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// you translations.
// you can also load translations from an external source
const resources ={
    en: {
        translation: {
            postListsTitle: "Post Lists",
            filterByIdTitle: "Filter by User Id",
            enterUserId: "Enter User Id",
            user: "User",
            by: "By",
            home: "Home",
            addPost: "Add Post",
            updatePost: "Update Post",
            deletePost: "Delete Post",
            comment: "Comment",


            // add more key-value pairs for each string you want to translate   
        },
    },
    fr: {
        translation: {
            postListsTitle: "Listes de Publications",
            filterByIdTitle: "Filtrer par ID Utilisateur",
            enterUserId: "Entrez l'ID utilisateur",
            user: "D' Utilisateur",
            by: "",
            home: "Page D'accueil",
            addPost: "Ajouter un message",
            updatePost: "Mettre à Jour le Message",
            deletePost: "Supprimer le message",
            comment: "Commentaire",

            // add your french translations here
        },
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // language to use initially
        keySeperator: false, // We do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false, // react already safeguards from XSS 
        },
    });

    export default i18n;