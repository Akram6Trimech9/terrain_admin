import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthStoreService } from '../../services/auth-store.service';
import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let authStore: AuthStoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthStoreService, TokenInterceptor],
    });

    interceptor = TestBed.inject(TokenInterceptor);
    authStore = TestBed.inject(AuthStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add the Authorization header if accessToken is present', () => {
    const mockUrl = '/test';
    const mockResponse = { data: 'test' };
    const mockAccessToken = '123456';

    authStore.setAccessToken(mockAccessToken);

    interceptor
      .intercept({ url: mockUrl, method: 'GET' } as any, {} as any)
      .subscribe((response) => {
        expect(response).toBeTruthy();
       });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.headers.has('labelebi')).toBeTrue();
    expect(req.request.headers.get('labelebi')).toEqual(
      `Bearer ${mockAccessToken}`
    );

    req.flush(mockResponse);
  });

  it('should not add the Authorization header if accessToken is not present', () => {
    const mockUrl = '/test';
    const mockResponse = { data: 'test' };

    // Clear the access token
    authStore.setAccessToken(null);

    // Send a test request
    interceptor
      .intercept({ url: mockUrl, method: 'GET' } as any, {} as any)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.headers.has('labelebi')).toBeFalse();

    req.flush(mockResponse);
  });
});
