export async function fetchNowPlayingMoviesData() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmE2ODBkYzU2OTA5MTFiMDk2NWQxNjIyNzRjYWQyNCIsInN1YiI6IjY0ZmVmNjlhZTBjYTdmMDBlYzhjNWUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LJE_93KtynJ8yD1ZKTuitPKLEHmKe7A1T6T_FsVyz2w'
    }
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=76a680dc5690911b0965d162274cad24', options);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API');
    }

    const data = await response.json();
    return data; // Retorna os dados da API
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchCommingSoonMoviesData() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmE2ODBkYzU2OTA5MTFiMDk2NWQxNjIyNzRjYWQyNCIsInN1YiI6IjY0ZmVmNjlhZTBjYTdmMDBlYzhjNWUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LJE_93KtynJ8yD1ZKTuitPKLEHmKe7A1T6T_FsVyz2w'
    }
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=76a680dc5690911b0965d162274cad24', options);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API');
    }

    const data = await response.json();
    return data; // Retorna os dados da API
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMovieTrailersData(movieTrailerId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmE2ODBkYzU2OTA5MTFiMDk2NWQxNjIyNzRjYWQyNCIsInN1YiI6IjY0ZmVmNjlhZTBjYTdmMDBlYzhjNWUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LJE_93KtynJ8yD1ZKTuitPKLEHmKe7A1T6T_FsVyz2w'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieTrailerId}/videos?api_key=76a680dc5690911b0965d162274cad24`, options);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API');
    }

    const data = await response.json();
    return data; // Retorna os dados da API
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMoviesGenres() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmE2ODBkYzU2OTA5MTFiMDk2NWQxNjIyNzRjYWQyNCIsInN1YiI6IjY0ZmVmNjlhZTBjYTdmMDBlYzhjNWUzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LJE_93KtynJ8yD1ZKTuitPKLEHmKe7A1T6T_FsVyz2w'
    }
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=76a680dc5690911b0965d162274cad24', options);
    if (!response.ok) {
      throw new Error('Erro na solicitação da API');
    }

    const data = await response.json();
    return data; // Retorna os dados da API
  } catch (error) {
    console.error(error);
    throw error;
  }
}