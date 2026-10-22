
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catalogue de livres</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">
  <h1>Catalogue de livres</h1>

  <!-- Formulaire d'ajout -->
  <form @submit.prevent="ajouterLivre">
    <div>
      <label for="title">Titre :</label>
      <input
        id="title"
        type="text"
        v-model.trim="newBook.title"
        placeholder="Titre du livre"
      >
    </div>

    <div>
      <label for="author">Auteur :</label>
      <input
        id="author"
        type="text"
        v-model.lazy="newBook.author"
        placeholder="Nom de l'auteur"
      >
    </div>

    <div>
      <label for="year">Année :</label>
      <input
        id="year"
        type="number"
        v-model.number="newBook.year"
        placeholder="Année de publication"
      >
    </div>

    <div>
      <label for="genre">Genre :</label>
      <select id="genre" v-model="newBook.genre">
        <option value="">Choisir un genre</option>
        <option value="Roman">Roman</option>
        <option value="Science-fiction">Science-fiction</option>
        <option value="Policier">Policier</option>
        <option value="Fantastique">Fantastique</option>
        <option value="Informatique">Informatique</option>
        <option value="Autre">Autre</option>
      </select>
    </div>

    <div>
      <label>
        <input type="checkbox" v-model="newBook.isFav">
        Ajouter aux favoris
      </label>
    </div>

    <!-- Ajout des mots-clés -->
    <div>
      <label for="keyword">Mots-clés :</label>
      <input
        id="keyword"
        type="text"
        v-model="nouveauMotCle"
        @keyup.enter.prevent="ajouterMotCle"
        placeholder="Saisir un mot-clé puis Entrée"
      >

      <div class="keywords">
        <span
          v-for="(mot, index) in newBook.keywords"
          :key="mot"
          class="chip"
        >
          {{ mot }}
          <button
            type="button"
            @click="retirerMotCle(index)"
          >×</button>
        </span>
      </div>
    </div>

    <button type="submit" :disabled="!formulaireValide">
      Ajouter
    </button>
  </form>

  <!-- Liste des livres -->
  <h2>Mes livres ({{ books.length }})</h2>

  <div class="books">
    <div
      v-for="book in books"
      :key="book.id"
      class="book"
      :class="{ favorite: book.isFav }"
      @click="toggleFavori(book)"
    >
      <h3>{{ book.title }}</h3>
      <p>Auteur : {{ book.author }}</p>
      <p>Année : {{ book.year }}</p>
      <p>Genre : {{ book.genre }}</p>

      <p>
        Favori :
        {{ book.isFav ? '⭐ Oui' : 'Non' }}
      </p>

      <div class="keywords">
        <span
          v-for="mot in book.keywords"
          :key="mot"
          class="chip"
        >
          {{ mot }}
        </span>
      </div>

      <button
        type="button"
        @click.stop="supprimerLivre(book)"
      >
        Supprimer
      </button>
    </div>
  </div>
</div>

<script src="app.js"></script>
</body>
</html>
