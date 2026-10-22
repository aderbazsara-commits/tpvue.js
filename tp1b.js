
<template>
  <div class="container">
    <h1>Budget étudiant</h1>

    <!-- Budget mensuel -->
    <div class="budget">
      <label>Budget mensuel (DH) :</label>
      <input
        type="number"
        v-model.number="budgetMensuel"
        min="0"
      />
    </div>

    <!-- Alerte budget : les conditions doivent être adjacentes -->
    <div v-if="totalGeneral < budgetMensuel * 0.8" class="ok">
      Budget maîtrisé : vous avez dépensé moins de 80 % du budget.
    </div>
    <div
      v-else-if="totalGeneral <= budgetMensuel"
      class="attention"
    >
      Attention : vous avez utilisé au moins 80 % de votre budget.
    </div>
    <div v-else class="depasse">
      Budget dépassé ! Vous avez dépensé plus que prévu.
    </div>

    <!-- Résumé -->
    <div class="resume">
      <p>Total des dépenses affichées : {{ totalFiltre.toFixed(2) }} DH</p>
      <p>Total général : {{ totalGeneral.toFixed(2) }} DH</p>
      <p>Moyenne par dépense : {{ moyenneDepense.toFixed(2) }} DH</p>
    </div>

    <!-- Filtres -->
    <h2>Filtrer les dépenses</h2>
    <div class="filtres">
      <button
        @click="selectionnerCategorie('toutes')"
        :class="{ active: filtreCategorie === 'toutes' }"
      >
        Toutes
      </button>

      <button
        @click="selectionnerCategorie('Alimentation')"
        :class="{ active: filtreCategorie === 'Alimentation' }"
      >
        Alimentation
      </button>

      <button
        @click="selectionnerCategorie('Transport')"
        :class="{ active: filtreCategorie === 'Transport' }"
      >
        Transport
      </button>

      <button
        @click="selectionnerCategorie('Loisirs')"
        :class="{ active: filtreCategorie === 'Loisirs' }"
      >
        Loisirs
      </button>

      <button
        @click="selectionnerCategorie('Études')"
        :class="{ active: filtreCategorie === 'Études' }"
      >
        Études
      </button>
    </div>

    <!-- Liste des dépenses -->
    <h2>Mes dépenses</h2>

    <div v-if="depensesFiltrees.length > 0">
      <div
        v-for="d in depensesFiltrees"
        :key="d.id"
        class="depense"
      >
        <div>
          <strong>{{ d.titre }}</strong>
          <p>Catégorie : {{ d.categorie }}</p>
          <p>Montant : {{ d.montant }} DH</p>
        </div>

        <button @click="supprimerDepense(d)">
          Supprimer
        </button>
      </div>
    </div>
    <p v-else>Aucune dépense dans cette catégorie.</p>

    <!-- Formulaire d'ajout -->
    <h2>Ajouter une dépense</h2>

    <form @submit.prevent="ajouterDepense">
      <input
        v-model.trim="nouvelleDepense.titre"
        type="text"
        placeholder="Titre de la dépense"
        required
      />

      <input
        v-model.number="nouvelleDepense.montant"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Montant en DH"
        required
      />

      <select v-model="nouvelleDepense.categorie" required>
        <option disabled value="">Choisir une catégorie</option>
        <option value="Alimentation">Alimentation</option>
        <option value="Transport">Transport</option>
        <option value="Loisirs">Loisirs</option>
        <option value="Études">Études</option>
      </select>

      <button type="submit">Ajouter</button>
    </form>

    <!-- Détail par catégorie -->
    <h2>Statistiques</h2>

    <button @click="afficherStats = !afficherStats">
      {{ afficherStats ? 'Masquer le détail par catégorie' :
        'Afficher le détail par catégorie' }}
    </button>

    <div v-show="afficherStats" class="stats">
      <div v-for="cat in categories" :key="cat">
        <p>{{ cat }} : {{ totalCategorie(cat).toFixed(2) }} DH</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      budgetMensuel: 1500,
      filtreCategorie: "toutes",
      afficherStats: false,
      prochainId: 4,

      categories: [
        "Alimentation",
        "Transport",
        "Loisirs",
        "Études"
      ],

      depenses: [
        {
          id: 1,
          titre: "Courses alimentaires",
          montant: 250,
          categorie: "Alimentation"
        },
        {
          id: 2,
          titre: "Bus",
          montant: 100,
          categorie: "Transport"
        },
        {
          id: 3,
          titre: "Cinéma",
          montant: 80,
          categorie: "Loisirs"
        }
      ],

      nouvelleDepense: {
        titre: "",
        montant: null,
        categorie: ""
      }
    };
  },

  computed: {
    depensesFiltrees() {
      if (this.filtreCategorie === "toutes") {
        return this.depenses;
      }

      return this.depenses.filter(
        d => d.categorie === this.filtreCategorie
      );
    },

    totalFiltre() {
      return this.depensesFiltrees.reduce(
        (total, d) => total + d.montant,
        0
      );
    },

    totalGeneral() {
      return this.depenses.reduce(
        (total, d) => total + d.montant,
        0
      );
    },

    moyenneDepense() {
      if (this.depensesFiltrees.length === 0) {
        return 0;
      }

      return this.totalFiltre / this.depensesFiltrees.length;
    }
  },

  methods: {
    selectionnerCategorie(cat) {
      this.filtreCategorie = cat;
    },

    ajouterDepense() {
      if (
        !this.nouvelleDepense.titre.trim() ||
        !this.nouvelleDepense.categorie ||
        this.nouvelleDepense.montant <= 0
      ) {
        return;
      }

      this.depenses.push({
        id: this.prochainId++,
        titre: this.nouvelleDepense.titre.trim(),
        montant: this.nouvelleDepense.montant,
        categorie: this.nouvelleDepense.categorie
      });

      this.nouvelleDepense = {
        titre: "",
        montant: null,
        categorie: ""
      };
    },

    supprimerDepense(depense) {
      this.depenses = this.depenses.filter(
        d => d.id !== depense.id
      );
    },

    totalCategorie(cat) {
      return this.depenses
        .filter(d => d.categorie === cat)
        .reduce((total, d) => total + d.montant, 0);
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
  padding: 9px;
  margin: 5px;
}

.resume, .budget, .depense, .stats {
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.ok, .attention, .depasse {
  padding: 12px;
  margin: 12px 0;
  border-radius: 6px;
}

.ok {
  background: #d8f5d0;
}

.attention {
  background: #fff0bb;
}

.depasse {
  background: #ffdada;
}

.active {
  background: #2457a7;
  color: white;
}

.depense {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
