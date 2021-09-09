// DOM elements
const $title = document.getElementById('title')
const $director = document.getElementById('director')
const $year = document.getElementById('year')

const $list = document.getElementById('movie-list')
const $form = document.getElementById('movie-form')
const $formContain = document.querySelector('.form-contain')

// Form validation
function checkForm(title, director, year) {

    let err = false

    if(title.value.trim() === ''){
        UI.setError(title, 'Title cannot be empty')
        err = true
    }else{
        UI.setSuccess(title)
    }

    if(director.value.trim() === ''){
        UI.setError(director, 'Director cannot be empty')
        err = true
    }else{
        UI.setSuccess(director)
    }

    if(isNaN(year.value) || year.value < 1888){
        UI.setError(year, "Please enter a valid year")
        err = true
    }else{
        UI.setSuccess(year)
    }

    return err
}

//  Represents a movie
class Movie {
    constructor(title, director, year, id) {
        this.title = title;
        this.director = director;
        this.year = year;
        this.id = id
    }
}

// Handle UI tasks
class UI {
    static displayMovies() {
        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovieToList(movie))
    }

    static addMovieToList(movie) {
        const row = document.createElement('tr')
        row.setAttribute('id', movie.id)

        row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td><button type="button" name="btn-delete" class="btn btn-sm btn-outline-secondary">Delete</button></td>
        `
        $list.appendChild(row)
    }

    static removeMovie(el) {
        if(el.name === 'btn-delete'){
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(msg, color){
        const div = document.createElement('div')
        div.className = `alert alert-${color}`
        div.appendChild(document.createTextNode(msg))

        $formContain.insertBefore(div, $form)
    
        // Alert disappear
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
    }

    static clearForm(form){
        $title.classList.remove('is-valid')
        $director.classList.remove('is-valid')
        $year.classList.remove('is-valid')
        form.reset()
    }

    static setError(input, message){
        
        input.classList.add('is-invalid')

        const bro = input.nextElementSibling.nextElementSibling
        bro.classList.add('invalid-feedback')
        bro.textContent = message
    }

    static setSuccess(input){
        input.classList.remove('is-invalid')
        input.classList.add('is-valid')

        const bro = input.nextElementSibling.nextElementSibling
        bro.classList.remove('invalid-feedback')
        bro.classList.add('valid-feedback')
        bro.textContent = ''
    }
}

// Storing data in the browser with localStorage
class Store {
    static getMovies() {
      let movies
      if(localStorage.getItem('movies') === null) {
        movies = []
      } else {
        movies = JSON.parse(localStorage.getItem('movies'))
      }
  
      return movies
    }
  
    static addMovie(movie) {
      const movies = Store.getMovies()
      movies.push(movie)
      localStorage.setItem('movies', JSON.stringify(movies))
    }
  
    static deleteMovie(id) {
      let movies = Store.getMovies()
  
      movies.forEach((movie, index) => {
        if(movie.id == id) {
          movies.splice(index, 1)
        }
      });
      localStorage.setItem('movies', JSON.stringify(movies))
    }
  }

// Event: Get movies
document.addEventListener('DOMContentLoaded', UI.displayMovies())

// Event: Add a movie
    $form.addEventListener('submit', (e)=>{
        e.preventDefault()

        if(checkForm($title, $director, $year) === false){
                        // Instatiate movie
                        const idMovie = parseInt(Date.now() / 1000) - 1631135014
                        const movie = new Movie($title.value, $director.value, $year.value, idMovie)
                        // Add movie to store
                        Store.addMovie(movie)
            
                        // Add movie to UI
                        UI.addMovieToList(movie)
            
                        // Show success message
                        UI.showAlert('Movie Added', 'info')
            
                        // Clear form
                        UI.clearForm(e.target)
        }else{
            UI.showAlert('Please check the form for errors', 'danger')
        }
    })


// Event: Remove a movie
    $list.addEventListener('click', (e)=>{
        //Remove movie from UI
        UI.removeMovie(e.target)

        // Remove movie from store
        Store.deleteMovie(e.target.parentElement.parentElement.id)

        // Show success message
        UI.showAlert('Successfully deleted', 'info');
    })


