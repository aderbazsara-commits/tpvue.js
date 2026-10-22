
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catalogue de livres</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>

<div id="app">
  <h1>Catalogue de livres</h1>

  <!-- Compteur de favoris -->
  <p>{{ nombreFavoris }} livre(s) favori(s)</p>

  <!-- Filtre des favoris -->
  <button @click="afficherFavoris = !afficherFavoris">
    {{ afficherFavoris
      ? 'Afficher tous les livres'
      : 'Afficher uniquement les favoris' }}
  </button>

  <!-- Affichage des livres -->
  <div class="books">
    <div
      v-for="book in livresAffiches"
      :key="book.id"
      class="book"
      :class="{ favori: book.isFav }"
    >
      <h2>{{ book.title }}</h2>
      <p>Auteur : {{ book.author }}</p>
      <p>Année : {{ book.year }}</p>

      <!-- Bouton détails -->
      <button @click="toggleDetails(book)">
        {{ book.detailsVisibles
          ? 'Masquer les détails'
          : 'Détails' }}
      </button>

      <!-- Genre masqué ou affiché -->
      <p v-show="book.detailsVisibles">
        Genre : {{ book.genre }}
      </p>

      <!-- Badge favori -->
      <span v-if="book.isFav" class="badge-favori">
        Favori
      </span>
    </div>
  </div>
</div>

<script src="app.js"></script>
</body>
</html>
