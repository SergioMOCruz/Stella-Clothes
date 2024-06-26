import { HttpInterceptorFn } from "@angular/common/http";
import { UserSessionHandlerService } from "../services/helpers/user-session-handler.service";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');

  const headers = req.headers.set('Authorization', `Bearer ${authToken}`);

  req = req.clone({
      headers
  });

  return next(req);
}
