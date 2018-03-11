import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';

// Sample Token Authentication
const httpOptions = {
  headers: new Headers({
    'Content-type': 'application/json; charset=UTF-8',
    'Authorization': 'my-auth-token-taken-form-the-server'
  })
};

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

  albums = [];
  showLoader: boolean;
  test: any;
  value = '';
  filterValue = '';
  order: string = 'title';
  reverse: boolean = false;
  selectedSort: string = "az";

  constructor(public http: Http, public snackBar: MatSnackBar) {

    // Initiallize default search
    this.search('Beatles');

  }

  search(searchVal) {
    let searchUrl = 'https://itunes.apple.com/search?term=' + searchVal + '&entity=album';
    // Empty Previous results
    this.albums = [];
    // Initiallize the spinner
    this.showLoader = true;

    this.http.get(searchUrl)
      .subscribe((res) => {
        let tempAlbum: any;
        tempAlbum = res;
        tempAlbum = JSON.parse(tempAlbum._body);

        // No results returned
        if (tempAlbum.resultCount == 0) {
          // TODO: Change this to a toast alert
          this.snackBar.open("No results available for that search", "OK", {
            duration: 2000,
          });
          console.log("No results available for that search")
        } else {
          this.albums = tempAlbum.results;

          // Get an image with a better quality
          this.albums.map((album) => {
            album.thumbnail = album.artworkUrl60.slice(0, -11) + '600x600bb.jpg';
          });
        }
        this.showLoader = false;


      }, (err) => {
        this.showLoader = false;
        this.snackBar.open("Error creating album" + JSON.stringify(err), "OK", {
          duration: 2000,
        });
        console.log(err);
      }
      // , () => {
      //   console.log('finished');
      // }
      );
  }


  // Sort the albumss
  getSort(event, selV) {

    if (this.selectedSort == 'az') {
      this.reverse = false;
    } else {
      this.reverse = true;
    }
  }

  ngOnInit() {
  }

}
