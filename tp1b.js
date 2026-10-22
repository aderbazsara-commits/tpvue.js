<template>
  <div class="container">
    <h1>Stock de la buvette associative</h1>

    <!-- Alerte globale -->
    <p v-if="nombreRupture > 0" class="alerte">
      Attention ! {{ nombreRupture }} article(s) en rupture de stock.
    </p>

    <!-- Resume global -->
    <div class="resume">
      <p>Valeur totale du stock : {{ valeurTotaleStock.toFixed(2) }} DH</p>
      <p>Nombre d'articles en rupture : {{ nombreRupture }}</p>
    </div>

    <!-- Recherche et filtre -->
    <div class="filtres">
      <input
        v-model="rechercheTexte"
        type="text"
        placeholder="Rechercher par nom..."
      />

      <select v-model="filtreCategorie">
        <option value="">Toutes les catégories</option>
        <option value="Boisson">Boisson</option>
        <option value="Snack">Snack</option>
        <option value="Autre">Autre</option>
      </select>
    </div>

    <!-- Liste des articles -->
    <div v-if="articlesFiltres.length === 0">
      Aucun article trouvé.
    </div>

    <div v-else>
      <div
        v-for="article in articlesFiltres"
        :key="article.id"
        class="article"
      >
        <h3>{{ article.nom }}</h3>

        <p>Catégorie : {{ article.categorie }}</p>
        <p>Prix unitaire : {{ article.prixUnitaire }} DH</p>
        <p>Quantité : {{ article.quantite }}</p>

        <!-- Les conditions doivent respecter cet ordre -->
        <span v-if="article.quantite === 0" class="rupture">
          Rupture
        </span>

        <span
          v-else-if="article.quantite <= article.seuilAlerte"
          class="faible"
        >
          Stock faible
        </span>

        <span v-else class="ok">
          Ok
        </span>

        <div class="actions">
          <button @click="incrementer(article)">+</button>
          <button @click="decrementer(article)">-</button>

          <button @click="toggleDetail(article)">
            Détail
          </button>

          <button @click="supprimerArticle(article)">
            Supprimer
          </button>
        </div>

        <!-- Detail de l'article -->
        <div
          v-show="articleDetailId === article.id"
          class="detail"
        >
          <p>Identifiant : {{ article.id }}</p>
          <p>Seuil d'alerte : {{ article.seuilAlerte }}</p>
          <p>
            Valeur du stock :
            {{ (article.quantite * article.prixUnitaire).toFixed(2) }} DH
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire d'ajout -->
    <h2>Ajouter un article</h2>

    <form @submit.prevent="ajouterArticle">
      <input
        v-model.trim="nouvelArticle.nom"
        placeholder="Nom de l'article"
        required
      />

      <select v-model="nouvelArticle.categorie" required>
        <option disabled value="">Choisir une catégorie</option>
        <option value="Boisson">Boisson</option>
        <option value="Snack">Snack</option>
        <option value="Autre">Autre</option>
      </select>

      <input
        v-model.number="nouvelArticle.prixUnitaire"
        type="number"
        min="0"
        step="0.01"
        placeholder="Prix unitaire"
        required
      />

      <input
        v-model.number="nouvelArticle.quantite"
        type="number"
        min="0"
        placeholder="Quantité"
        required
      />

      <input
        v-model.number="nouvelArticle.seuilAlerte"
        type="number"
        min="0"
        placeholder="Seuil d'alerte"
        required
      />

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      rechercheTexte: "",
      filtreCategorie: "",
      articleDetailId: null,
      prochainId: 5,

      articles: [
        {
          id: 1,
          nom: "Eau",
          categorie: "Boisson",
          quantite: 20,
          prixUnitaire: 5,
          seuilAlerte: 5
        },
        {
          id: 2,
          nom: "Jus",
          categorie: "Boisson",
          quantite: 3,
          prixUnitaire: 8,
          seuilAlerte: 5
        },
        {
          id: 3,
          nom: "Chips",
          categorie: "Snack",
          quantite: 0,
          prixUnitaire: 6,
          seuilAlerte: 4
        },
        {
          id: 4,
          nom: "Biscuits",
          categorie: "Snack",
          quantite: 10,
          prixUnitaire: 4,
          seuilAlerte: 3
        }
      ],

      nouvelArticle: {
        nom: "",
        categorie: "",
        quantite: 0,
        prixUnitaire: 0,
        seuilAlerte: 5
      }
    };
  },

  computed: {
    // Recherche par nom ET filtre par categorie
    articlesFiltres() {
      return this.articles.filter(article => {
        const correspondNom = article.nom
          .toLowerCase()
          .includes(this.rechercheTexte.toLowerCase());

        const correspondCategorie =
          this.filtreCategorie === "" ||
          article.categorie === this.filtreCategorie;

        return correspondNom && correspondCategorie;
      });
    },

    // Valeur totale de TOUS les articles
    valeurTotaleStock() {
      return this.articles.reduce((total, article) => {
        return total + article.quantite * article.prixUnitaire;
      }, 0);
    },

    // Nombre d'articles dont la quantite est exactement zero
    nombreRupture() {
      return this.articles.filter(article => article.quantite === 0)
        .length;
    }
  },

  methods: {
    incrementer(article) {
      article.quantite++;
    },

    decrementer(article) {
      if (article.quantite > 0) {
        article.quantite--;
      }
    },

    toggleDetail(article) {
      if (this.articleDetailId === article.id) {
        this.articleDetailId = null;
      } else {
        this.articleDetailId = article.id;
      }
    },

    supprimerArticle(article) {
      this.articles = this.articles.filter(
        a => a.id !== article.id
      );

      if (this.articleDetailId === article.id) {
        this.articleDetailId = null;
      }
    },

    ajouterArticle() {
      if (
        !this.nouvelArticle.nom.trim() ||
        !this.nouvelArticle.categorie ||
        this.nouvelArticle.prixUnitaire < 0 ||
        this.nouvelArticle.quantite < 0 ||
        this.nouvelArticle.seuilAlerte < 0
      ) {
        return;
      }

      this.articles.push({
        id: this.prochainId++,
        nom: this.nouvelArticle.nom.trim(),
        categorie: this.nouvelArticle.categorie,
        prixUnitaire: this.nouvelArticle.prixUnitaire,
        quantite: this.nouvelArticle.quantite,
        seuilAlerte: this.nouvelArticle.seuilAlerte
      });

      this.nouvelArticle = {
        nom: "",
        categorie: "",
        quantite: 0,
        prixUnitaire: 0,
        seuilAlerte: 5
      };
    }
  }
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
}

input, select, button {
  padding: 8px;
  margin: 5px;
}

.article, .resume {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin: 12px 0;
}

.alerte {
  background: #ffe0e0;
  color: #a00000;
  padding: 12px;
}

.rupture {
  background: #ffcccc;
  color: #a00000;
  padding: 5px;
}

.faible {
  background: #fff0bb;
  color: #805600;
  padding: 5px;
}

.ok {
  background: #d4f5d4;
  color: #176b17;
  padding: 5px;
}

.detail {
  margin-top: 10px;
  padding: 10px;
  background: #f2f2f2;
}

.actions {
  margin-top: 10px;
}
</style>
