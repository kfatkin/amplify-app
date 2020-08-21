import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APIService } from './API.service';
import { Restaurant } from './../types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public createForm: FormGroup;
  restaurants: Array<Restaurant>;

  constructor(private api: APIService, private fb: FormBuilder) {}

  async ngOnInit() {
    // List Restaurants
    this.api.ListRestaurants().then((event) => {
      this.restaurants = event.items;
    });

    // Subscribe to Changes
    this.api.OnCreateRestaurantListener.subscribe((event: any) => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    });

    // Form for inputting data
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  // Submit Data
  public onCreate(restaurant: any) {
    this.api
      .CreateRestaurant(restaurant)
      .then((event) => {
        console.log('item created!');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating restaurant...', e);
      });
  }
}
