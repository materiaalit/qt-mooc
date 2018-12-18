import { uniqueId, kebabCase, last, set, dropRight } from 'lodash';

import { scrollToId } from './utils';

class TableOfContents {
  mount() {
    this.headingNodes = $('.material-heading');
    this.rootNode = $('#table-of-contents');
    this.listNode = $('#table-of-contents-list');
    this.layerNode = $('#table-of-contents-layer');
    this.toggleNode = $('#table-of-contents-toggle');

    this.rootNode.on('click', '.table-of-contents__link', this.onClickTableOfContentsLink.bind(this));
    this.layerNode.on('click', this.hide.bind(this));
    this.toggleNode.on('click', this.show.bind(this));

    this.addNumbers();

    Object.keys(this.sectionNumbers).forEach(key => {
      this.constructTableOfContents(this.listNode, this.sectionNumbers[key]);
    });
  }

  show() {
    this.layerNode.addClass('table-of-contents-layer--visible');
    this.rootNode.addClass('table-of-contents--visible');
  }

  hide() {
    this.layerNode.removeClass('table-of-contents-layer--visible');
    this.rootNode.removeClass('table-of-contents--visible');
  }

  onClickTableOfContentsLink(e) {
    e.preventDefault();

    const id = e.target.getAttribute('href').substring(1);

    scrollToId(id);

    this.hide();
  }

  addNumbers() {
    let indices = [];

    this.sectionNumbers = {};

    this.headingNodes.each((index, node) => {
      const headingNode = $(node);

      const id = `${uniqueId('section-')}-${kebabCase(headingNode.text())}`;

      headingNode.attr('id', id);

      const hIndex = parseInt(node.nodeName.substring(1)) - 1;

      if (indices.length - 1 > hIndex) {
        indices = indices.slice(0, hIndex + 1 );
      }

      if (indices[hIndex] == undefined) {
        indices[hIndex] = 0;
      }

      indices[hIndex]++;

      const sectionString = indices.join('.');

      set(this.sectionNumbers, sectionString,  {
        title: headingNode.text(),
        href: `#${id}`,
        sectionString
      });

      if(sectionString.split('.').length >= 2) {
        const previousSectionNumber = dropRight(sectionString.split('.')).join('.');
        const currentSectionNumber = last(sectionString.split('.'));

        set(this.sectionNumbers, `${previousSectionNumber}.children.${currentSectionNumber}`, true);
      }

      headingNode.prepend(`
        <small class="text-muted">
          ${sectionString}.
        </small>
      `);
    });
  }

  constructTableOfContents(parentNode, root) {
    if(root) {
      const children = Object.keys(root.children || {});

      const hasChildren = children.length > 0;
      const level = root.sectionString.split('.').length - 1;

      const newNode = $(`
        <li>
          <a href="${root.href}" class="table-of-contents__link table-of-contents__link--level-${level}">
            ${root.sectionString}. ${root.title}
          </a>
        </li>
      `);

      parentNode.append(newNode);

      if(hasChildren) {
        const newParentNode = $('<ul></ul>');

        newNode.append(newParentNode);

        children.forEach(child => {
          this.constructTableOfContents(newParentNode, root[child]);
        });
      }
    }
  }
}

export default TableOfContents;
