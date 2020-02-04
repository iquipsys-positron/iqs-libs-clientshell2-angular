import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { SessionConfig, SESSION_CONFIG } from '../models/SessionConfig';
import { IqsSessionConfigService } from '../services/session.config.service';
import { IqsSessionService } from '../services/session.service';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    // @Inject(SESSION_CONFIG) private config: SessionConfig,
    @Inject(WINDOW) private window: WindowWrapper,
    private router: Router,
    private sessionConfig: IqsSessionConfigService,
    private sessionService: IqsSessionService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifySession(state.url);
  }

  verifySession(url: string): boolean {
    if (this.sessionService.session && this.sessionService.session.id) { return true; }

    // Navigate to the login page with extras
    this.window.location.href = this.window.location.origin + this.sessionConfig.unautorizedUrl + '?from=' + this.router.url;
    return false;
  }
}
