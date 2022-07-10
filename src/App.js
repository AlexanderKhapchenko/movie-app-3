import { useEffect, useState } from 'react';
import './App.css';
import YouTube from 'react-youtube';
import { getByName, getWithVideos, pageTypeMap } from './api';
import { MovieList } from './components/movie-list';
import { Header } from './components/header';

function App() {
	const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

	const [movies, setMovies] = useState([]);
	const [searchKey, setSearchKey] = useState('');
	const [selectedMovie, setSelectedMovie] = useState('');
	const [playTrailer, setPlayTrailer] = useState(false);
	const [availableTrailer, setAvailableTrailer] = useState(true);
	const [page, setPage] = useState(1);
	const [pageType, setPageType] = useState(Object.keys(pageTypeMap)[0]);
	const [isLoadMoreAvailable, setIsLoadMoreAvailable] = useState(true);

	const selectMovie = async (movie) => {
		setPlayTrailer(false);
		const data = await getWithVideos(movie.id);
		setSelectedMovie(data);

		checkAvailableTrailer(data);
	}

	const checkAvailableTrailer = (movie) => {
		const isAvailable = Boolean(movie.videos.results.length);
		setAvailableTrailer(isAvailable);
	}

	useEffect(() => {
		async function callApi() {
			const { results } = await pageTypeMap[pageType]();//getPopular();
			selectMovie(results[0]);
			console.log(results);
			setMovies(results);
			setPage(1);
		}
		callApi();
	}, [pageType]);

	useEffect(() => {
		async function callApi() {
			const {results, totalPages } = await pageTypeMap[pageType](page);
			console.log("totalPages", totalPages);
			console.log("page", page);
			setIsLoadMoreAvailable(totalPages > page);
			selectMovie(results[0]);
			setMovies([...movies, ...results]);
		}
		callApi();
	}, [page]);

	const renderTrailer = () => {
		const trailer = selectedMovie.videos.results.find(vid => vid.name === "Official Trailer");
		const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;

		return (
			<YouTube
				videoId={key}
				className="youtube-container"
				opts={{
					width: '100%',
					height: '100%',
					playerVars: {
						autoplay: 1,
						controls: 0
					},
				}}
			/>
		)
	}

	const searchMovies = async (e) => {
		e.preventDefault();
		const results = await getByName(searchKey);
		setMovies(results);
		selectMovie(results[0]);
	}

	const renderPageTypes = () => {
		return Object.keys(pageTypeMap).map(item => {
			return (
				<button 
					className={item === pageType && 'page-type-current'} 
					onClick={() => setPageType(item)}
				>
					{item}
				</button>
			)})
	}

  return (
    <div className="App">
			<Header
				searchMovies={searchMovies}
				setSearchKey={setSearchKey}
			/>

			{renderPageTypes()}

			<div className="hero" style={{backgroundImage: `url(${IMAGE_PATH + selectedMovie.backdrop_path})`}}>
				<div className="content">
					{selectedMovie.videos && playTrailer && renderTrailer()}
					{availableTrailer && <button className='button' onClick={() => setPlayTrailer(true)}>Play Trailer</button>}
					
					<h2 className='title'>{selectedMovie.title}</h2>
					<p className='overview'>{selectedMovie.overview}</p>
				</div>
			</div>

			<MovieList
				movies={movies}
				selectMovie={selectMovie} 
				onLoadMore={() => setPage(page + 1)} 
				isLoadMoreAvailable={isLoadMoreAvailable}
			/>
    </div>
  );
}

export default App;
