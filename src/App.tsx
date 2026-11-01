import React, { useState } from 'react';
import './App.css';
import axios from "axios";
import {links, moviesRaw, filmsImgs} from './movies';

interface IMovie{
  title: string;
  category: string;
  nominee?: string;
  watched?: boolean;
  link?: string;
}

interface IMovieListProps{
  movies: IMovie[];
  category: string;
}

interface IMovieProps{
  title: string;
  nominee?: string;
  watched?: boolean;
  link: string;
}

interface IPlaceholderProps{
  isLoading: boolean
}

function Movie ({ title,  nominee, watched, link }: IMovieProps){
  const posterUrl = filmsImgs[title.toLowerCase()];

  console.log(title, watched, posterUrl)
  return (
    <div className="movie-card">
      <a href={link} target='_blank' rel='noreferrer'>
      {watched === true ?
      <img src={posterUrl} alt={title} className="poster-image-watched" />:
      <img src={posterUrl} alt={title} className="poster-image" />}
      <p className="movie-title">{title}</p>
      {nominee!==undefined? <p className="category-text">{nominee}</p>:<p></p>}
      </a>
    </div>
  );
};

const MovieList = ({movies, category} :IMovieListProps) => {
  const filteredMovies = movies.filter(movie => movie.category === category);

  return (
    <div className="movie-list-container">
    <h2 className="category-title">{category}</h2>
    <div className="movies-container">
      <div className="movie-row">
        {filteredMovies.map(movie => (
          <Movie 
          title={movie.title} 
          nominee={movie.nominee} 
          watched={movie.watched}
          link={links[movie.title.toLowerCase()] || ""}/>
        ))}
      </div>
    </div>
  </div>
  );
};

const TenisVerdeHeader = ({handleSearch, disabled, setUser}:any) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Chama a mesma função do botão
    }
  };

  return (
    <div className="tenis-verde-container">
      <h1 className="tenis-verde-title">Tênis Verde</h1>
      <div className="search-bar">
        <input type="text" 
        placeholder="Digite o nome do usuário" 
        className="search-input" 
        onChange={e=>setUser(e.target.value)}
        onKeyDown={handleKeyDown}/>
        <button 
        className="search-button"
        disabled={disabled}
        onClick={handleSearch}
        >Buscar</button>
      </div>
    </div>
  );
};

function AllMovies({movies} :any){
  return (
    <div>
      <MovieList movies={movies} category="Melhor Filme" />
      <MovieList movies={movies} category="Melhor Direção" />
      <MovieList movies={movies} category="Melhor Ator" />
      <MovieList movies={movies} category="Melhor Atriz" />
      <MovieList movies={movies} category="Melhor Ator Coadjuvante" />
      <MovieList movies={movies} category="Melhor Atriz Coadjuvante" />
      <MovieList movies={movies} category="Melhor Roteiro Original" />
      <MovieList movies={movies} category="Melhor Roteiro Adaptado" />
      <MovieList movies={movies} category="Melhor Animação" />
      <MovieList movies={movies} category="Melhor Filme Internacional" />
      <MovieList movies={movies} category="Melhor Documentário" />
      <MovieList movies={movies} category="Melhor Documentário em Curta Metragem" />
      <MovieList movies={movies} category="Melhor Curta-Metragem" />
      <MovieList movies={movies} category="Melhor Curta-Metragem de Animação" />
      <MovieList movies={movies} category="Melhor Trilha Sonora" />
      <MovieList movies={movies} category="Melhor Canção Original" />
      <MovieList movies={movies} category="Melhor Som" />
      <MovieList movies={movies} category="Melhor Design de Produção" />
      <MovieList movies={movies} category="Melhor Fotografia" />
      <MovieList movies={movies} category="Melhor Cabelo e Maquiagem" />
      <MovieList movies={movies} category="Melhor Figurino" />
      <MovieList movies={movies} category="Melhor Montagem" />
      <MovieList movies={movies} category="Melhores Efeitos Visuais" />
    </div>
  )
}

function Placeholder({isLoading}: IPlaceholderProps){
  if(isLoading){
    return (
      <div className="centralized-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
        <img src="https://i.imgur.com/npUk2Ng.jpeg" alt="Descrição da imagem" className="centered-image" />
      </div>
    )
  }
  return(
    <div className="centralized-container">
      <img src="https://i.imgur.com/S0cLqKg.jpeg" alt="Descrição da imagem" className="centered-image" />
    </div>
  )
}


function App() {
  const [movies, setMovies] = useState(moviesRaw);
  const [user, setUser] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  async function getUserMovies(){
    const baseApi = `https://oscar-letterboxd-back.vercel.app`;
    let hasMoreMovies = true;
    let allFilms:string[] = []
    let page=1;
    while(hasMoreMovies){
      const resp = await axios.get(`${baseApi}/user-movies?user_name=${user}&page=${page}`);
      allFilms = [...allFilms, ...resp.data.movies.map((el: string)=>el.toLowerCase())]
      page++;
      hasMoreMovies = resp.data.hasMoreMovies;
    }
    const moviesSet = new Set(allFilms);
    const moviesWatched: IMovie[] = [...movies].map(el=>{
      if(moviesSet.has(el.title.toLowerCase())){
        el["watched"] = true;
      }
      return el;
    })
    console.log(moviesWatched)
    setMovies(moviesWatched);
  }

  async function searchUser(){
    if(user!=""){
      setReadyToShow(false);
      setDisabled(true);
      await getUserMovies();
      setDisabled(false);
      setReadyToShow(true)
    }
  }
  
  return (
    <div className="App">
      <TenisVerdeHeader handleSearch={searchUser} disabled={disabled} setUser={setUser}/>
      {readyToShow?
      <AllMovies movies={movies}/> :
      <Placeholder isLoading={disabled}/>}
      
    </div>
  );
}

export default App;
