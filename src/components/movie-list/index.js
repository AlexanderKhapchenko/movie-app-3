import { MovieCard } from "../movie-card"

export function MovieList({movies, selectMovie, onLoadMore, isLoadMoreAvailable}) {
	const renderMovies = () => {
		return movies.map(movie => 
				<MovieCard
					key={movie.id}
					movie={movie}
					selectMovie={selectMovie}
				/>
		)
	}
	
	return (
		<div className="container">
			{renderMovies()}
		{isLoadMoreAvailable && <button className='btn-load-more' onClick={onLoadMore}>Load More</button>}
	</div>
	)
}