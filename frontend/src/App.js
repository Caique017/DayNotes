import React, { useState, useEffect } from "react";

import api from './services/api';

import './global.css';
import './sidebar.css';
import './app.css';
import './main.css';

import Notes from './components/Notes'
import RadioButton from "./components/Notes/RadioButton";

// Componente = é uma estrutura de códgo que me retorna HTML, CSS e JS.
// Propriedades = São informações que um componente pai passa para um componente filho
// Estado = Função que armazena uma informação e manipula.

function App () {

    const [ title, setTitles ] = useState('')
    const [ notes, setNotes ] = useState('')
    const [ AllNotes, setAllNotes ] = useState([])

    useEffect(() =>{
        getAllNotes()
    }, [])

    async function getAllNotes(){
        const response = await api.get('/annotations')
        setAllNotes(response.data)
    }
    
    async function handleDelete(id) {
        const deletedNote = await api.delete(`/annotations/${id}`);

        if(deletedNote) {
            setAllNotes(AllNotes.filter(note => note._id !== id));
        }
    }

    async function handleChangePriority(id) {
        const note = await api.post(`/priorities/${id}`);

        if(note) {
            getAllNotes();
        } 
    }

   async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/annotations', {
            title,
            notes,
            priority: false
        })

        setTitles ('')
        setNotes ('')

        setAllNotes([ ...AllNotes, response.data ])
    }

    useEffect(()=> {
        function enableSubmitButton() {
            let btn = document.getElementById('btn_submit')
            btn.style.background = '#ffd3ca'
            if(title && notes) {
                btn.style.background = "#eb8f7a"
            }
        }
        enableSubmitButton()
    }, [title, notes])

    return (
        <div id="app">
            <aside>
                <strong>Caderno de notas</strong>
                <form onSubmit={handleSubmit}>

                    <div className="input-block">
                        <label htmlFor="title">Título da anotação</label>
                        <input 
                        required
                        maxLength="30"
                        value={title}
                        onChange={e => setTitles(e.target.value)}
                        />
                    </div>

                    <div className="input-block">
                        <label htmlFor="nota">Anotações</label>
                        <textarea 
                        required
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <button id="btn_submit" type="submit">Salvar</button>
                </form>
                <RadioButton />
            </aside>
            <main>
                <ul>
                    {AllNotes.map(data => (
                    <Notes
                    key={data._id}
                    data={data}
                    handleDelete={handleDelete}
                    handleChangePriority={handleChangePriority}
                    />

                    ))}
                </ul>
            </main>
        </div>
    );
}

export default App;
