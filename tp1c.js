
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tableau de bord de notes</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>

<div id="app">
  <h1>Tableau de bord de notes</h1>

  <!-- Moyenne générale -->
  <h2>Moyenne générale : {{ moyenneGenerale }}</h2>

  <!-- Mention automatique : 5 branches -->
  <p v-if="moyenneGenerale >= 16">Très bien</p>
  <p v-else-if="moyenneGenerale >= 14">Bien</p>
  <p v-else-if="moyenneGenerale >= 12">Assez bien</p>
  <p v-else-if="moyenneGenerale >= 10">Passable</p>
  <p v-else>Insuffisant</p>

  <!-- Meilleur et moins bon module -->
  <h3>Meilleur module</h3>
  <p v-if="moduleMax">
    {{ moduleMax.nom }} : {{ moduleMax.note }}
  </p>
  <p v-else>Aucun module</p>

  <h3>Moins bon module</h3>
  <p v-if="moduleMin">
    {{ moduleMin.nom }} : {{ moduleMin.note }}
  </p>
  <p v-else>Aucun module</p>

  <!-- Recherche -->
  <h2>Liste des modules</h2>
  <input
    v-model="recherche"
    placeholder="Rechercher un module..."
  >

  <!-- Ajout d'un module -->
  <form @submit.prevent="ajouterModule">
    <input v-model="nouveauNom" placeholder="Nom du module" required>
    <input
      v-model.number="nouvelleNote"
      type="number"
      min="0"
      max="20"
      step="0.01"
      placeholder="Note"
      required
    >
    <input
      v-model.number="nouveauCoefficient"
      type="number"
      min="0.01"
      step="0.01"
      placeholder="Coefficient"
      required
    >
    <button type="submit">Ajouter</button>
  </form>

  <!-- Classement -->
  <table border="1" cellpadding="8">
    <thead>
      <tr>
        <th>Module</th>
        <th>Note</th>
        <th>Coefficient</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="module in modulesAffiches" :key="module.id">
        <td>{{ module.nom }}</td>
        <td>{{ module.note }}</td>
        <td>{{ module.coefficient }}</td>
        <td>
          <button @click="supprimerModule(module)">
            Supprimer
          </button>
          <button @click="toggleDetail(module)">
            Détail
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modules à rattraper -->
  <h2>
    Modules à rattraper
    <span>{{ modulesARattraper.length }}</span>
  </h2>

  <ul>
    <li v-for="module in modulesARattraper" :key="module.id">
      {{ module.nom }} : {{ module.note }}/20
    </li>
  </ul>

  <!-- Panneau de détail -->
  <div v-show="detailVisible">
    <h2>Détail du module</h2>
    <p v-if="moduleSelectionne">
      Nom : {{ moduleSelectionne.nom }}<br>
      Note : {{ moduleSelectionne.note }}<br>
      Coefficient : {{ moduleSelectionne.coefficient }}
    </p>
    <button @click="detailVisible = false">Fermer</button>
  </div>

  <p v-if="tousValides">Tous les modules sont validés !</p>
  <p v-else>Il reste des modules à valider.</p>
</div>

<script>
const { createApp } = Vue;

createApp({
  data() {
    return {
      modules: [
        { id: 1, nom: "Algorithmique", note: 16, coefficient: 3 },
        { id: 2, nom: "Base de données", note: 12, coefficient: 2 },
        { id: 3, nom: "Programmation Web", note: 8, coefficient: 3 },
        { id: 4, nom: "Mathématiques", note: 14, coefficient: 4 },
        { id: 5, nom: "Réseaux", note: 9, coefficient: 2 }
      ],

      recherche: "",
      nouveauNom: "",
      nouvelleNote: null,
      nouveauCoefficient: null,

      prochainId: 6,
      detailVisible: false,
      moduleSelectionne: null
    };
  },

  computed: {
    // 1. Moyenne pondérée
    moyenneGenerale() {
      const sommePonderee = this.modules.reduce(
        (total, module) =>
          total + module.note * module.coefficient,
        0
      );

      const sommeCoefficients = this.modules.reduce(
        (total, module) => total + module.coefficient,
        0
      );

      if (sommeCoefficients === 0) {
        return 0;
      }

      return Number(
        (sommePonderee / sommeCoefficients).toFixed(2)
      );
    },

    // 2. Modules à rattraper
    modulesARattraper() {
      return this.modules.filter(
        module => module.note < 10
      );
    },

    // 3. Classement décroissant sans modifier le tableau original
    modulesTries() {
      return [...this.modules].sort(
        (a, b) => b.note - a.note
      );
    },

    // 4. Recherche insensible à la casse
    modulesAffiches() {
      return this.modulesTries.filter(module =>
        module.nom.toLowerCase().includes(
          this.recherche.toLowerCase()
        )
      );
    },

    // 5. Meilleur module
    moduleMax() {
      if (this.modulesTries.length === 0) {
        return null;
      }

      return this.modulesTries[0];
    },

    // 6. Moins bon module
    moduleMin() {
      if (this.modulesTries.length === 0) {
        return null;
      }

      return this.modulesTries[
        this.modulesTries.length - 1
      ];
    },

    // Aller plus loin : tous les modules validés
    tousValides() {
      return this.modules.every(
        module => module.note >= 10
      );
    }
  },

  methods: {
    // Ajouter un module
    ajouterModule() {
      if (
        !this.nouveauNom.trim() ||
        this.nouvelleNote === null ||
        this.nouvelleNote === "" ||
        this.nouvelleNote < 0 ||
        this.nouvelleNote > 20 ||
        this.nouveauCoefficient === null ||
        this.nouveauCoefficient === "" ||
        this.nouveauCoefficient <= 0
      ) {
        return;
      }

      this.modules.push({
        id: this.prochainId++,
        nom: this.nouveauNom.trim(),
        note: this.nouvelleNote,
        coefficient: this.nouveauCoefficient
      });

      this.nouveauNom = "";
      this.nouvelleNote = null;
      this.nouveauCoefficient = null;
    },

    // Supprimer un module
    supprimerModule(module) {
      this.modules = this.modules.filter(
        element => element.id !== module.id
      );

      if (
        this.moduleSelectionne &&
        this.moduleSelectionne.id === module.id
      ) {
        this.detailVisible = false;
        this.moduleSelectionne = null;
      }
    },

    // Afficher ou masquer le détail
    toggleDetail(module) {
      if (
        this.detailVisible &&
        this.moduleSelectionne &&
        this.moduleSelectionne.id === module.id
      ) {
        this.detailVisible = false;
      } else {
        this.moduleSelectionne = module;
        this.detailVisible = true;
      }
    }
  }
}).mount("#app");
</script>

</body>
</html>
