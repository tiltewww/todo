const app = Vue.createApp({
    data() {
        return {
            newTask: "",
            newDeadline: "",
            selectedDate: "",
            selectedTime: "",
            showDatePicker: false,
            tasks: JSON.parse(localStorage.getItem("tasks")) || [],
            isDark: JSON.parse(localStorage.getItem("darkMode")) ?? window.matchMedia("(prefers-color-scheme: dark)").matches
        };
    },
    watch: {
        tasks: {
            deep: true,
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            }
        },
        isDark(newValue) {
            document.body.classList.toggle("dark-mode", newValue);
            localStorage.setItem("darkMode", JSON.stringify(newValue));
        }
    },
    mounted() {
        document.body.classList.toggle("dark-mode", this.isDark);

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            this.isDark = e.matches;
        });

        this.checkDeadlines();
        setInterval(this.checkDeadlines, 60000);
    },
    methods: {
        addTask() {
            if (!this.newTask.trim()) return;

            let finalDeadline = null;
            if (this.selectedDate && this.selectedTime) {
                finalDeadline = `${this.selectedDate}T${this.selectedTime}`;
            } else if (this.selectedDate) {
                finalDeadline = `${this.selectedDate}T23:59`;
            } else if (this.selectedTime) {
                const today = new Date().toISOString().split("T")[0];
                finalDeadline = `${today}T${this.selectedTime}`;
            }

            this.tasks.push({
                text: this.newTask,
                deadline: finalDeadline,
                done: false,
                overdue: false
            });

            this.newTask = "";
            this.selectedDate = "";
            this.selectedTime = "";
            this.newDeadline = "";
            this.showDatePicker = false;
            this.checkDeadlines();
        },
        toggleTask(index) {
            if (!this.tasks[index].overdue) {
                this.tasks[index].done = !this.tasks[index].done;
            }
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
        },
        confirmDate() {
            this.showDatePicker = false;
        },
        checkDeadlines() {
            const now = new Date();
            this.tasks.forEach(task => {
                if (task.deadline && new Date(task.deadline) < now) {
                    task.overdue = true;
                    task.done = false;
                } else {
                    task.overdue = false;
                }
            });
        },
        formatDeadline(date) {
            if (!date) return "Без дедлайна";
            const deadlineDate = new Date(date);
            const now = new Date();
            return deadlineDate < now ? "Просрочено!" : deadlineDate.toLocaleString();
        }
    }
});

app.mount("#app");
