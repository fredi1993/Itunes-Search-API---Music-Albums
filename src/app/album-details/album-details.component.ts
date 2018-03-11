import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  id: number;
  private sub: any;
  showLoader2: boolean;
  albumGenDetails: any;
  albumTracks = [];


  constructor(private route: ActivatedRoute, public http: Http, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // Get route parameter
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getAlbumDetails(this.id);

    });
  }

  getAlbumDetails(id) {
    this.showLoader2 = true;
    let searchUrl = 'https://itunes.apple.com/lookup?id=' + id + '&entity=song';


    this.http.get(searchUrl)
      .subscribe((res) => {

        let tempAlbum: any;
        tempAlbum = res;
        tempAlbum = JSON.parse(tempAlbum._body);

        // The first element of the array contains all the album information
        this.albumGenDetails = tempAlbum.results[0];

        // Get an image with better quality
        this.albumGenDetails.thumbnail = this.albumGenDetails.artworkUrl60.slice(0, -11) + '600x600bb.jpg';

        // All the other array elements are the tracks of the album
        this.albumTracks = tempAlbum.results.slice(1);
        this.showLoader2 = false;

      }, (err) => {
        this.showLoader2 = false;
        this.snackBar.open("No results available for that search", "OK", {
          duration: 2000,
        });
        console.log(err);
      });

  }


  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

}
