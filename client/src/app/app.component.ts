import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FileDropComponent } from './components/file-drop/file-drop.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileDropComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'font-condenser-client';
}
