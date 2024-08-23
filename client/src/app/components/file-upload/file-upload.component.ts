import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FontService } from '../../services/font-service/font.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  constructor(private fontService: FontService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fontService.uploadFont(file).subscribe({
        next: (response: Blob) => {
          this.downloadFile(response);
        },
        error: (error) => {
          console.error('Error during file upload:', error);
        },
      });
    }
  }

  downloadFile(data: Blob): void {
    const blob = new Blob([data], { type: 'application/font-otf' }); // Specify the MIME type of the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CondensedFont.otf'; // Filename for the downloaded file
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
  }
}
