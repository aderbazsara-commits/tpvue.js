<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini-projet - Liste des personnes</title>

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

    <style>
        img {
            float: left;
            margin-right: 1rem;
        }

        .personne {
            clear: left;
            padding: 1rem;
            overflow: auto;
        }

        input[type="checkbox"], select {
            margin-right: 1rem;
        }

        .misEnForme {
            background: #e0ffff;
            font-family: Georgia, serif;
            font-size: 1.2rem;
            margin: 1rem;
        }
    </style>
</head>

<body>
<div id="app">

    <fieldset>
        <legend>Filtre sur le nom</legend>
        <input type="text" v-model="filtreNom"
               placeholder="Rechercher par nom">
    </fieldset>

    <fieldset>
        <legend>Options</legend>

        Homme
        <input type="checkbox" v-model="homme">

        Femme
        <input type="checkbox" v-model="femme">

        Téléphone et e-mail
        <input type="checkbox" v-model="contact">

        Photo
        <select v-model="taille">
            <option value="1">Petit</option>
            <option value="2">Moyen</option>
            <option value="3">Grand</option>
        </select>

        Mise en forme
        <input type="checkbox" v-model="mef">
    </fieldset>

    <div v-for="p in personnesFiltrees"
         :key="p.email"
         class="personne"
         :class="{ misEnForme: mef }">

        <img :src="photo(p)"
             :alt="'Photo de ' + p.name.first"
             :style="{ width: largeurPhoto + 'px' }">

        <strong>
            {{ p.name.title }} {{ p.name.first }} {{ p.name.last }}
        </strong>

        <p>Pays : {{ p.location.country }}</p>

        <div v-if="contact">
            <p>Téléphone : {{ p.phone }}</p>
            <p>E-mail : {{ p.email }}</p>
        </div>

    </div>

    <p v-if="personnesFiltrees.length === 0">
        Aucune personne trouvée.
    </p>

</div>

<script>
const app = Vue.createApp({
    data() {
        return {
            personnes: [],
            homme: true,
            femme: true,
            contact: false,
            mef: false,
            taille: "2",
            filtreNom: ""
        };
    },

    computed: {
        personnesFiltrees() {
            return this.personnes.filter(p => {
                // Filtrer par sexe
                const sexeOK =
                    (this.homme && p.gender === "male") ||
                    (this.femme && p.gender === "female");

                // Filtrer par nom
                const nomOK = p.name.last
                    .toLowerCase()
                    .includes(this.filtreNom.toLowerCase());

                return sexeOK && nomOK;
            });
        },

        largeurPhoto() {
            if (this.taille === "1") return 50;
            if (this.taille === "2") return 100;
            return 200;
        }
    },

    methods: {
        photo(p) {
            if (this.taille === "1") {
                return p.picture.thumbnail;
            }

            if (this.taille === "2") {
                return p.picture.medium;
            }

            return p.picture.large;
        }
    },

    mounted() {
        fetch("personnes.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur de chargement du fichier JSON");
                }
                return response.json();
            })
            .then(data => {
                // Accepter un tableau direct ou un objet contenant results
                this.personnes = Array.isArray(data)
                    ? data
                    : data.results || [];
            })
            .catch(error => {
                console.error(error);
            });
    }
});

app.mount("#app");
</script>

</body>
</html>
