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
  currentUser: any = null;
  currentFavs: any = null;
  
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

ngOnInit(): void {
  this.getMovies();
  
  
}

/**
 * uses API end-point to get a list of all movies in json format
 * @function getAllMovies
 */

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
 
/**
 * opens the dialog to display the information from DirectorCardComponent
 * @param name {string}
 * @param bio {string}
 * @param birth {string}
 */

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


    /**
     * opens the dialog to display the information from GenreCardComponent
     * @param name{string}
     * @param description{string}
     */
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

  /**
   * opens the dialog to display the information from SynopsisCardComponent
   * @param title 
   * @param description 
   */

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

  /**
   * use API end-point to add a movie to user's favorites
   * @function addFavoriteMovies
   * @param id {string}
   * @param Title {string}
   * @returns an array of the movie object in json format 
   */
  addToUserFavs(id: string, Title: string): void {
    console.log(id);
    const token = localStorage.getItem('token');
    console.log(token)
    this.fetchApiData.addFavoriteMovies(id).subscribe((res: any) => {
      this.snackBar.open(`Successfully added ${Title} to favorite movies.`, 'OK', {
        duration: 4000,
        verticalPosition: 'top'
      });
      console.log(res)
      this.ngOnInit();
    });
  }

 

  addToFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.addFavoriteMovies(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    })
  }

    /**
   * user API end-point to remove a movie from user's favorites
   * @function deleteFavoriteMovies
   * @param id {string}
   * @param Title {string}
   * @returns updated user's data in json format
   */
   deleteFavoriteMovies(id: string, Title: string): void {
    console.log(id)
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((res: any) => {
      this.snackBar.open(`${Title} has been removed from favorites`, 'OK', {
        duration: 2000,
        verticalPosition: 'top'
      });
      this.ngOnInit();
      console.log(res)
    });
  
  }
}

