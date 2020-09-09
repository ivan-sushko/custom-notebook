Vue.filter("date", time => moment(time).format("DD/MM/YYYY, HH:mm:ss"));

new Vue({
    el: "#notebook",
    data() {
        return {
            notes: JSON.parse(localStorage.getItem("notes")) || [],
            selectedId: localStorage.getItem("selected-id") || null,
        };
    },
    computed: {
        notePreview() {
            return this.selectedNote ? marked(this.selectedNote.content) : "";
        },
        addButtonTitle() {
            return this.notes.length + " note(s) already";
        },
        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId);
        },
        sortedNotes() {
            return this.notes.slice()
                                    .sort((a,b) => a.created - b.created)
                                    .sort((a,b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1);
        },
        linesCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length;
            };
        },
        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content;
                s = s.replace(/\n/g, " ");
                s = s.replace(/(^\s*)|(\s$)/gi, "");
                s = s.replace(/\s\s+/gi, " ");
                return s.split(" ").length;
            };
        },
        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split("").length;
            };
        },
    },
    watch: {
        notes: {
            handler: "saveNotes",
            deep: true,
        },
        selectedId(value) {
            localStorage.setItem("selected-id", value);
        },
    },
    methods: {
        addNote() {
            const time = Date.now();

            const note = {
                id: String(time),
                title: "New Note " + (this.notes.length + 1),
                content: "Hello!",
                created: time,
                favorite: false,
            };

            this.notes.push(note);
        },
        removeNote() {
            if (this.selectedNote && confirm("Delete the note?")) {
                const index = this.notes.indexOf(this.selectedNote);
                if (index !== -1) {
                    this.notes.splice(index, 1);
                }
            }
        },
        saveNotes() {
            localStorage.setItem("notes", JSON.stringify(this.notes));
            console.log("NOTES SAVED!", new Date());
        },
        selectNote(note) {
            this.selectedId = note.id;
        },
        favoriteNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite;
        },
    },
    created() {

    },
});
