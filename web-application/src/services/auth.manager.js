let authFac = {},
  TOKEN_KEY = 'Token',
  isAuthenticated = false,
  username = '',
  authToken = undefined,
  resource = null,
  http = null,
  rootScope = null,
  LocalStorage = null,
  baseURL = null;

class AuthManager {

  /*@ngInject;*/
  constructor($resource, $http, $rootScope, LocalStorage, baseURL) {
    resource = $resource;
    http = $http;
    rootScope = $rootScope;
    LocalStorage = LocalStorage;
    baseURL = baseURL;
    loadUserCredentials();
  }

  loadUserCredentials() {
    let credentials = LocalStorage.get(TOKEN_KEY, '{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }

  storeUserCredentials(credentials) {
    LocalStorage.store(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    LocalStorage.remove(TOKEN_KEY);
  }

  login(loginData) {
    $resource(baseURL + "users/login")
      .save(loginData,
      function (response) {
        storeUserCredentials({ username: loginData.username, token: response.token });
        $rootScope.$broadcast('login:Successful');
      },
      function (response) { });
  }

  register(registerData) {
    $resource(baseURL + "users/register")
      .save(registerData,
      function (response) {
        login({ username: registerData.username, password: registerData.password });
        if (registerData.rememberMe) {
          LocalStorage.store('userinfo',
            { username: registerData.username, password: registerData.password });
        }
        $rootScope.$broadcast('registration:Successful');
      },
      function (response) { });
  }

  logout() {
    $resource(baseURL + "users/logout").get(function (response) {
      destroyUserCredentials();
    });
  }

  isAuthenticated() {
    returnisAuthenticated;
  }

  getUsername() {
    return username;
  }
}

export default AuthManager;