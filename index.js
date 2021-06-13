"use strict"

let app = new Vue({
	name: 'notebook',
	
	data() {
		return {
			notes: JSON.parse(localStorage.getItem('notes')) || [],
			selectedId: localStorage.getItem('selected-id') || null,
		};
	},
	
	computed: {
		selectedNote() {
			return this.notes.find( note => note.id === this.selectedId );
		},
		
		notePreview() {
			return marked(this.selectedNote.content);
		},
		
		showTitle() {
			return this.notes.length + ' notes already';
		},
		
		sortedNotes() {
			/*
			Since sort modifies the source array directly, we should create a copy of
			it with the slice method. This will prevent unwanted triggers of the
			notes watcher.
			*/
			return this.notes.slice()
				.sort( ( elem_first, elem_second ) => elem_first.date - elem_second.date )
				
				/*
				If both notes are favorite, we don't change their position. If elem_first is favorite, we return
				a negative number to put it before elem_second. In the other case, we return a positive
				number, so elem_second is put before elem_first in the list.
				*/
				.sort( ( elem_first, elem_second ) => ( elem_first.favorite === elem_second.favorite ) ? 0 :
					( elem_first.favorite ) ? -1 :
					1
				);
		},
	},
	
	watch: {
		notes: {
			handler: 'saveNotes',
			deep: true,
		},
		
		selectedId(value) {
			localStorage.setItem('selected-id', value);
		},
	},
	
	methods: {
		addNote() {
			const time = Date.now();
			const note = {
				id: String(time),
				title: `Note #${ this.notes.length + 1 }`,
				content: 'Start typing here. You will see the *result* on the **right pane**',
				date: time,
				favorite: false,
			};
			
			this.notes.push(note);
			this.selectNote(note);
		},
		
		removeNote() {
			if ( this.selectNote && confirm('Delete the note?') ) {
				const index = this.notes.indexOf(this.selectedNote);
				if ( index !== -1 ) {
					this.notes.splice(index, 1);
				}
			}
		},
		
		selectNote(note) {
			this.selectedId = note.id;
		},
		
		favoriteNote() {
			this.selectedNote.favorite = !this.selectedNote.favorite;
		},
		
		saveNotes() {
			localStorage.setItem('notes', JSON.stringify(this.notes));
			console.log('All notes saved!', new Date());
		},
	},
});

app.$mount('#notebook');