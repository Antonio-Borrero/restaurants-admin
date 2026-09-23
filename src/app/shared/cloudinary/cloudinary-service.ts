import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface CloudinaryResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private http = inject(HttpClient);

  uploadImage(file: File, preset: string) {
    const image = new FormData();
    image.append('file', file);
    image.append('upload_preset', preset);

    return this.http.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${environment.cloudinaryName}/image/upload`,
      image,
    );
  }
}
