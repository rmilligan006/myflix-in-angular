import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { UserEditComponent } from '../user-edit/user-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  username: any = localStorage.getItem('user');
  movies: any[] = [];
  favoriteMovies: any[] = [];
  displayElement: boolean = false

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Gets user data from api call and sets the user variable to returned JSON file
   * @returns object holding user information
   * @function getUser
   */
  getUser(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      return this.user;
    })
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie: any) => {
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.favoriteMovies.push(movie);
        }
      });
    });
    console.log(this.favoriteMovies);
  }

  /**
   * opens the edit profile dialog from EditProfileComponent to allow user to edit their details
   */
  openEditProfileDialog(): void {
    this.dialog.open(UserEditComponent, {
      width: '300px'
    })
  }

  openSynopsis(title: string, imagePath: any, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        ImagePath: imagePath,
        Description: description,
      },
      width: '500px',
      panelClass: 'synopsis-custom'
    });
  }

  /**
   * opens the dialog to display the DirectorCardComponent
   * @param title {string}
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   */
  openDirectorDialog(title: string, name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Title: title,
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      width: '500px',
      panelClass: 'director-custom'
    });
  }

  /**
   * opens the dialog to display the GenreCardComponent
   * @param title {string}
   * @param name {string}
   * @param description {string}
   */
  openGenreDialog(title: string, name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Title: title,
        Name: name,
        Description: description,
      },
      width: '500px',
      panelClass: 'genre-custom'
    });
    console.log('Name: ' + name)
  }


  /**
   * deletes the user profile, redirects to welcome screen
   * @function deleteUserProfile
   */
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account? This cannnot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('You have successfully deleted your account!', 'OK', {
          duration: 2000
        });
      })
      this.fetchApiData.deleteUserProfile().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
  deleteFavoriteMovies(MovieID: string, Title: string): void {
    this.fetchApiData.deleteFavoriteMovies(MovieID).subscribe((res: any) => {
      this.snackBar.open(`Successfully removed ${Title} from favorite movies.`, 'OK', {
        duration: 4000, verticalPosition: 'top'
      });
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    });
  }
}