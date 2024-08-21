import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-file-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-drop.component.html',
  styleUrl: './file-drop.component.css',
})
export class FileDropComponent {
  file: File = Object.create(File);
  message: string = '';
  output: string = '';

  formData: FormData = new FormData();

  constructor(private fileService: FileService) {}

  onFileChange = (event: any) => {
    this.file = event.target.files[0];
    this.formData.append('file', this.file);
  };

  onFileUpload = () => {
    if (this.file) {
      this.sendFormData();
      this.message = 'File dropped';
    } else {
      this.message = 'No file dropped';
    }
  };

  sendFormData() {
    this.fileService.postFile(this.formData).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        this.message = error;
      },
      complete: () => {},
    });
  }
}
