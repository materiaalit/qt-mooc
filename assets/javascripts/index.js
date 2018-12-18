try {
  require('babel-polyfill');
} catch(e) {
  console.log(e);
}

import * as store from 'store';

import '../stylesheets/index.scss';

import Exercises from './exercises';
import TableOfContents from './table-of-contents';
import LoginModal from './login-modal';
import Navigation from './navigation';

import './youtube-loader';

function loginReset() {
  if (!store.get('tmc.loginReset')) {
    store.remove('tmc.user');
    store.remove('tmc.course');
    store.set('tmc.loginReset', '1');
  }
}

$(() => {
  loginReset();

  (new Exercises()).mount();
  (new TableOfContents()).mount();
  (new LoginModal()).mount();
  (new Navigation()).mount();
});
