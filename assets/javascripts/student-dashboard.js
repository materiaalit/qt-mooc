import TmcClient from 'tmc-client-js';
import * as store from 'store';

const client = new TmcClient();

function getCourseName() {
  return store.get('tmc.course');
}


function getOhpeKevat18Config() {
  return {
    courseId: '287',
    courseName: 'Ohjelmoinnin perusteet',
    exerciseGroups: {
      'Osa 1': ['15.01.2018 12:00', '22.01.2018 23:59', 'osa01-'],
      'Osa 2': ['18.01.2018 18:00', '29.01.2018 23:59', 'osa02-'],
      'Osa 3': ['26.01.2018 14:00', '05.02.2018 23:59', 'osa03-'],
      'Osa 4': ['02.02.2018 22:00', '12.02.2018 23:59', 'osa04-'],
      'Osa 5': ['09.02.2018 23:00', '19.02.2018 23:59', 'osa05-'],
      'Osa 6': ['16.02.2018 23:30', '26.02.2018 23:59', 'osa06-'],
      'Osa 7': ['23.02.2018 10:00', '05.03.2018 23:59', 'osa07-']
    },
  }
}

function getOhjaKevat18Config() {
  return {
    courseId: '305',
    courseName: 'Ohjelmoinnin jatkokurssi',
    exerciseGroups: {
      'Osa 8': ['09.03.2018 12:00', '19.03.2018 23:59', 'osa08-'],
      'Osa 9': ['12.03.2018 12:00', '26.03.2018 23:59', 'osa09-'],
      'Osa 10': ['19.03.2018 12:00', '09.04.2018 23:59', 'osa10-'],
      'Osa 11': ['26.03.2018 12:00', '16.04.2018 23:59', 'osa11-'],
      'Osa 12': ['02.04.2018 12:00', '23.04.2018 23:59', 'osa12-'],
      'Osa 13': ['13.04.2018 20:00', '30.04.2018 23:59', 'osa13-'],
      'Osa 14': ['20.04.2018 18:00', '07.05.2018 23:59', 'osa14-']
    },
  }
}

function getMoocConfig() {
  return {
    courseId: '288',
    courseName: 'Ohjelmoinnin MOOC',
    exerciseGroups: {
      'Osa 1': ['13.01.2018 12:00', '26.02.2018 23:59', 'osa01-'],
      'Osa 2': ['18.01.2018 18:00', '26.02.2018 23:59', 'osa02-'],
      'Osa 3': ['26.01.2018 14:00', '26.02.2018 23:59', 'osa03-'],
      'Osa 4': ['02.02.2018 22:00', '26.02.2018 23:59', 'osa04-'],
      'Osa 5': ['09.02.2018 23:00', '05.03.2018 23:59', 'osa05-'],
      'Osa 6': ['16.02.2018 23:30', '12.03.2018 23:59', 'osa06-'],
      'Osa 7': ['23.02.2018 10:00', '19.03.2018 23:59', 'osa07-'],
      'Osa 8': ['02.03.2018 12:00', '26.03.2018 23:59', 'osa08-'],
      'Osa 9': ['09.03.2018 23:00', '02.04.2018 23:59', 'osa09-'],
      'Osa 10': ['16.03.2018 12:00', '09.04.2018 23:59', 'osa10-'],
      'Osa 11': ['23.03.2018 12:00', '16.04.2018 23:59', 'osa11-'],
      'Osa 12': ['02.04.2018 12:00', '23.04.2018 23:59', 'osa12-'],
      'Osa 13': ['13.04.2018 20:00', '30.04.2018 23:59', 'osa13-'],
      'Osa 14': ['20.04.2018 18:00', '07.05.2018 23:59', 'osa14-']
    }
  };
}

function getConfig() {
  const courseName = getCourseName();

  switch(courseName) {
    case 'hy-ohpe-k18':
      return getOhpeKevat18Config();
      break;
    case 'hy-ohja-k18':
      return getOhjaKevat18Config();
      break;
  case 'mooc-ohjelmointi-2018':
      return getMoocConfig();
      break;
    default:
      return getMoocConfig();
  }
}

function init() {
  const courseName = getCourseName();

  if(courseName === '2018-ohjelmointi-nodl') {
    return;
  }

  if(courseName === '2018-ohjelmointi-jatkokurssi-nodl') {
    return;
  }
    
  const user = client.getUser();

  const config = Object.assign({}, getConfig(), { accessToken: user.accessToken, userId: user.username });

  window.StudentDashboard.initialize(config);
}

function initStudentDashboard() {
  if(!window._STUDENT_DASHBOARD_ENABLED) {
    return;
  }

  if(window.StudentDashboard) {
    init();
  } else {
    document.addEventListener('studentDashboardLoaded', init);
  }
}

export default initStudentDashboard;
