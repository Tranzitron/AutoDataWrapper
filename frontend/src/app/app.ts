import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Brands} from './brands/brands';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Brands],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AutoDataWrapper');
}
