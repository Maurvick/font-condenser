import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  private apiUrl = 'http://localhost:3000/run-script'; // Your server's API endpoint

  constructor(private http: HttpClient) {}

  // Uploads the file to the backend and triggers the file download
  uploadFont(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    // Make POST request to the server and expect a Blob (binary data) in return
    return this.http.post(this.apiUrl, formData, { responseType: 'blob' });
  }
}
