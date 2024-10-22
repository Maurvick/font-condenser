import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  downloadUrl: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.errorMessage = null;
    this.successMessage = null;
    this.uploadFiles();
  }

  uploadFiles(): void {
    if (!this.selectedFiles.length) return;

    const formData = new FormData();
    this.selectedFiles.forEach((file) => formData.append('files', file));

    const headers = new HttpHeaders();
    this.isLoading = true;

    this.http
      .post('http://localhost:3000/condense-fonts', formData, {
        headers,
        observe: 'events',
        responseType: 'blob', // We're expecting a blob for download
      })
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            if (event.body) {
              // Handle successful response (downloadable ZIP)
              this.downloadUrl = URL.createObjectURL(event.body); // Create a download URL
              this.successMessage = 'Fonts processed successfully!';
              this.isLoading = false;
            }
          }
        },
        (error) => {
          this.errorMessage = 'Error processing the fonts!';
          this.isLoading = false;
        }
      );
  }
}
