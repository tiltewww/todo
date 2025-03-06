"use strict";
const app = Vue.createApp({
    data() {
        return {
            newTask: "",
            newDeadline: "",
            tasks: JSON.parse(localStorage.getItem("tasks")) || [],
            isDark: window.matchMedia("(prefers-color-scheme: dark)").matches
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
            localStorage.setItem("darkMode", newValue);
        }
    },
    mounted() {
        if (localStorage.getItem("darkMode") !== null) {
            this.isDark = JSON.parse(localStorage.getItem("darkMode"));
        }
        document.body.classList.toggle("dark-mode", this.isDark);

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            this.isDark = e.matches;
        });
    },
    methods: {
        addTask() {
            if (!this.newTask.trim()) return;
            this.tasks.push({
                text: this.newTask,
                deadline: this.newDeadline || null,
                done: false,
                favorite: false
            });
            this.newTask = "";
            this.newDeadline = "";
        },
        toggleTask(index) {
            if (!this.isOverdue(this.tasks[index])) {
                this.tasks[index].done = !this.tasks[index].done;
            }
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
        },
        openDatePicker() {
            const datePicker = this.$refs.datePicker;
            datePicker.showPicker ? datePicker.showPicker() : datePicker.focus();
        },
        isOverdue(task) {
            return task.deadline && new Date(task.deadline) < new Date();
        },
        formatDeadline(date) {
            return new Date(date).toLocaleString();
        }
    }
});

app.mount("#app");
