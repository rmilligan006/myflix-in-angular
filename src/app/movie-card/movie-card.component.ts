// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

ngOnInit(): void {
  this.getMovies();
  
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
 
  openDirectorDialog(name: string, bio: string, birth: Date): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      // Assign dialog width
      width: '500px'
    });

  }
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px',
      panelClass: 'genre-custom'
    });
  }

  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      // Assign dialog width
      width: '500px'
    });

  }
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp;
      console.log(this.favoriteMovies);
      return this.favoriteMovies;
    });
  }

  /**
   * checks if a movie is included in the user's list of favorite movies
   * @param id 
   * @returns true, if the movie is a favorite move, else false
   */
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id)
  }

  addToFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.addFavoriteMovies(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    })
  }

  /**
   * removes a movie from the list of favorite movies via an API call
   * @param id 
   * @function removeFavoriteMovie
   */
  removeFromFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    })
  }

}

