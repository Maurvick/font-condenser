import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  postFile(formData: FormData) {
    return this.http.post('http://localhost:3000/run-script', formData);
  }
}
