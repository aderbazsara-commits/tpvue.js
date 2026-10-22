
const TaskList = {
    data() {
        return {
            tasks: [],
            filtre: "toutes"
        };
    },

    computed: {
        // Nombre total de tâches
        totalTasks() {
            return this.tasks.length;
        },

        // Liste des tâches selon le filtre
        filteredTasks() {
            if (this.filtre === "todo") {
                return this.tasks.filter(t => !t.completed);
            }

            if (this.filtre === "completed") {
                return this.tasks.filter(t => t.completed);
            }

            return this.tasks;
        }
    },

    methods: {
        // Charger les tâches depuis le fichier JSON
        chargerTasks() {
            fetch("tasks.json")
                .then(response => response.json())
                .then(data => {
                    this.tasks = data;
                })
                .catch(error => {
                    console.error("Erreur de chargement :", error);
                });
        },

        // Marquer une tâche comme terminée
        terminerTask(task) {
            task.completed = true;
        }
    },

    mounted() {
        this.chargerTasks();
    },

    template: `
        <div>
            <h2>Gestion des tâches</h2>

            <p v-if="tasks.length === 0">
                Aucune tâche chargée.
            </p>

            <p v-else>
                Nombre total de tâches : {{ totalTasks }}
            </p>

            <div class="filtres">
                <button
                    @click="filtre = 'toutes'"
                    :class="{ actif: filtre === 'toutes' }">
                    Toutes
                </button>

                <button
                    @click="filtre = 'todo'"
                    :class="{ actif: filtre === 'todo' }">
                    À faire
                </button>

                <button
                    @click="filtre = 'completed'"
                    :class="{ actif: filtre === 'completed' }">
                    Terminées
                </button>
            </div>

            <div
                v-for="task in filteredTasks"
                :key="task.id"
                class="task"
                :class="{ terminee: task.completed }">

                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>

                <p v-if="task.completed">
                    Statut : Terminée
                </p>

                <p v-else>
                    Statut : À faire
                </p>

                <button
                    v-show="!task.completed"
                    @click="terminerTask(task)">
                    Marquer comme terminée
                </button>
            </div>
        </div>
    `
};
