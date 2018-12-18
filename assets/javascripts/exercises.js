import { uniqueId, kebabCase, chunk } from 'lodash';
import { scrollToId } from './utils';

class Exercises {
  mount() {
    $('#exercise-list').on('click', '.exercise-list__link', this.onClickExerciseLink.bind(this));

    this.headingNodes = $('.exercise h1, .exercise h2');
    this.exerciseNodes = $('.exercise');
    this.exerciseListNode = $('#exercise-list');

    this.addIds();
    this.addNumbers();
    this.renderExecisesList();
  }

  addIds() {
    this.exerciseNodes.each(function() {
      const exerciseNode = $(this);
      const collapseNode = exerciseNode.find('.collapse');
      const toggleNode = exerciseNode.find('.exercise__toggle');
      const headingNode = exerciseNode.find('.exercise__heading');

      const id = `${uniqueId('exercise-')}-${kebabCase(headingNode.text())}`;

      exerciseNode.attr('data-name', headingNode.text());
      exerciseNode.attr('data-href', `#${id}`);
      exerciseNode.attr('id', `${id}-root`);
      collapseNode.attr('id', id);
      toggleNode.attr('href', `#${id}`);
    });
  }

  addNumbers() {
    let indices = [];
    const exerciseNames = [];

    this.headingNodes.each(function() {
      const headingNode = $(this);
      const hIndex = parseInt(this.nodeName.substring(1)) - 1;

      if(hIndex === 0) {
        const exerciseNode = headingNode.closest('.exercise');

        exerciseNames.push({
          name: exerciseNode.data('name'),
          href: exerciseNode.data('href')
        });
      }

      if (indices.length - 1 > hIndex) {
        indices = indices.slice(0, hIndex + 1 );
      }

      if (indices[hIndex] == undefined) {
        indices[hIndex] = 0;
      }

      indices[hIndex]++;

      headingNode.prepend(`
        <small class="text-muted">
          Exercise ${indices.join('.')}:
        </small>
      `);
    });

    this.exerciseNames = exerciseNames;
  }

  onClickExerciseLink(e) {
    const id = `${e.target.getAttribute('href').substring(1)}-root`;

    scrollToId(id);
  }

  renderExecisesList() {
    const template = _.chain(this.exerciseNames)
      .map((exercise, index) => `
        <div class="exercise-list__item col col-lg-4 col-md-6 col-sm-12">
          <a data-toggle="collapse" class="exercise-list__link" href="${exercise.href}">
            Exercise ${index + 1}: ${exercise.name}
          </a>
        </div>
      `)
      .chunk(3)
      .map(chunk => `
        <div class="row">
          ${chunk.join('')}
        </div>
      `)
      .value()
      .join('');

    this.exerciseListNode.html(template);
  }
}

export default Exercises;
