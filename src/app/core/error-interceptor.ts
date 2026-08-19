import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(
        `HTTP Error: ${error.status} on ${req.method} ${req.url}:`,
        error.error?.error?.message ?? error.message,
      );
      return throwError(() => error);
    }),
  );
};
