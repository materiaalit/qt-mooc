import TmcClient from 'tmc-client-js';
import * as store from 'store';

import initQuiznator from './quiznator';
import initStudentDashboard from './student-dashboard';
import pheromones from './pheromones';
import jsLogger from './js-logger';

const client = new TmcClient("2d2084443754c26933fa53548177386c8210bff472e8bd157df84033f24cadd5", "34a49ed3d20b8a524889cc64a4668e9fced34ab41b7c74a11689a4602e906a12");


class LoginModal {
  mount() {
    this.loginErrorNode = $('#tmc-login-error');
    this.loginFormNode = $('#tmc-login-form');
    this.loginModalToggleNode = $('#tmc-login-toggle');
    this.loginModalNode = $('#tmc-login-modal');
    this.loginUsernameNode = $('#tmc-login-username');
    this.loginPasswordNode = $('#tmc-login-password');

    this.updateLoginButtonText();

    if(client.getUser()) {
      this.afterLogin();
    } else if(window.location.pathname !== '/' && window.location.pathname !== '/qt-mooc/') {
      this.loginModalNode.modal('show');
    }

    this.loginModalToggleNode.on('click', this.onToggleLoginModal.bind(this));
    this.loginFormNode.on('submit', this.onSubmitLoginForm.bind(this));
  }

  afterLogin() {
    initQuiznator();
    initStudentDashboard();

    const researchAgreement = localStorage.getItem('research-agreement') || window['research-agreement'] || ""
    const agreed = researchAgreement.indexOf('j71pjmey1n') !== -1
    window['research-agreement-agreed'] = agreed

    window.initCodeStatesVisualizer();
    window.initTyponator();
    window.initCrowdsorcerer();

    if (!agreed) {
      return;
    }

    this.initPheromones();

    this.initLogger();

    //this.getUserGroup();
  }

  getUserGroup() {
    const user = client.getUser();

    fetch(`https://ab-studio.testmycode.io/api/v0/ab_studies/typonator_s17_ohpe/group?oauth_token=${user.accessToken}`).then(function(response) {
      return response.json();
    }).then(function(data) {
      if(parseInt(data.group) == 1) {
        // no ab testing at the moment window.initTyponator();
      }
    });
  }

  initPheromones(){
    const { username } = client.getUser();


    pheromones.init({
      apiUrl: 'https://data.pheromones.io/',
      username,
      submitAfter: 20
    });
  }

  initLogger() {
    const { username } = client.getUser();

    jsLogger.setUser(username);
    jsLogger.setApiUrl('https://data.pheromones.io/');
    jsLogger.init();
  }

  getLoginText() {
    return 'Login';
  }

  getLogOutText({ username }) {
    return `Logout ${username}`;
  }

  showError(message) {
    this.loginErrorNode.text(message);
    this.loginErrorNode.show();
  }

  hideError() {
    this.loginErrorNode.hide();
  }

  updateLoginButtonText() {
    if(client.getUser()) {
      this.loginModalToggleNode.text(this.getLogOutText({ username: client.getUser().username }));
    } else {
      this.loginModalToggleNode.text(this.getLoginText());
    }
  }

  onToggleLoginModal(e) {
    e.preventDefault();

    if(client.getUser()) {
      client.unauthenticate();

      try {
        localStorage.removeItem('research-agreement')
        window.StudentDashboard.destroy();
        window.Quiznator.removeUser();
      } catch(e) {}
    } else {
      this.loginModalNode.modal('show');
    }

    this.updateLoginButtonText();
  }

  onSubmitLoginForm(e) {
    e.preventDefault();

    this.hideError();

    const username = this.loginUsernameNode.val();
    const password = this.loginPasswordNode.val();
    const courseNode = this.loginFormNode.find('input[name="tmcLoginCourse"]:checked');

    if(courseNode.length === 0) {
      this.showError('You haven\'t chosen a course');
    } else if(!username || !password) {
      this.showError('Username or password missing');
    } else {
      const course = courseNode.val();

      store.set('tmc.course', course);

      client.authenticate({ username: username, password: password })
        .then(response => {
          this.loginModalNode.modal('hide');
          this.loginUsernameNode.val('');
          this.loginPasswordNode.val('');

          this.updateLoginButtonText();
          this.afterLogin();
        })
        .catch(() => {
          this.showError('Username or password incorrect');
        });
    }
  }
}

export default LoginModal;
