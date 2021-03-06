/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
CLASS({
  package: 'foam.browser.ui',
  name: 'BrowserView',
  extendsModel: 'foam.ui.DetailView',
  requires: [
    'foam.browser.BrowserConfig',
    'foam.browser.ui.StackView',
    'foam.graphics.ActionButtonCView',
    'foam.input.touch.GestureManager',
    'foam.input.touch.TouchManager',
    'foam.ui.DAOListView',
    'foam.ui.PopupChoiceView',
    'foam.ui.md.DetailView',
    'foam.ui.md.SharedStyles',
    'foam.ui.md.UpdateDetailView',
  ],

  exports: [
    'gestureManager',
    'stack',
    'touchManager',
  ],

  models: [
    {
      name: 'InnerBrowserView',
      extendsModel: 'foam.ui.DetailView',
      requires: [
        'foam.ui.PopupChoiceView',
        'foam.ui.SpinnerView',
      ],
      imports: [
        'stack',
      ],
      exports: [
        'selection$',
      ],
      properties: [
        {
          name: 'data',
          postSet: function(old, nu) {
            if (old) old.unsubscribe(old.MENU_CLOSE, this.onMenuTouch);
            if (nu) nu.subscribe(nu.MENU_CLOSE, this.onMenuTouch);
          },
        },
        {
          name: 'className',
          defaultValue: 'browser'
        },
        {
          name: 'selection',
          documentation: 'Used in the list view.',
          postSet: function(old, nu) {
            if (nu) {
              this.data.dao.find(nu.id, {
                put: function(obj) {
                  this.stack.pushView(this.data.detailView({
                    data: obj,
                    innerView: this.data.innerDetailView
                  }, this.Y.sub({ dao: this.data.dao })));
                }.bind(this)
              });
              this.selection = '';
            }
          }
        },
        {
          name: 'menuExpanded',
          defaultValue: false
        },
        {
          name: 'menuView_',
        },
        {
          name: 'menuHeaderView_',
        },
        {
          name: 'menuOpen',
          defaultValue: false,
          postSet: function(old, nu) {
            if (nu) {
              var html = '';
              if (this.data.menuHeaderView) {
                this.menuHeaderView_ = this.data.menuHeaderView();
                html += this.menuHeaderView_.toHTML();
              }
              this.menuView_ = this.data.menuFactory();
              html += this.menuView_.toHTML();
              this.X.$(this.id + '-menu-body').innerHTML = html;
              if (this.menuHeaderView_) this.menuHeaderView_.initHTML();
              this.menuView_.initHTML();
            } else if (this.menuView_) {
              this.menuView_.destroy();
              this.menuView_ = '';
              if (this.menuHeaderView_) {
                this.menuHeaderView_.destroy();
                this.menuHeaderView_ = '';
              }
            }
          },
        },
        {
          name: 'searchMode',
          defaultValue: false
        },
        {
          name: 'spinner',
          factory: function() {
            if ( ! this.data.busyStatus ) return;
            return this.SpinnerView.create({
              data$: this.data.busyStatus.busy$,
              color: '#fff'
            });
          }
        },
        {
          name: 'listView_',
          hidden: true,
          documentation: 'Internal. The View object created by the listView.'
        },
        {
          name: 'sortOrderView_',
          factory: function() {
            if (!this.data.sortChoices || this.data.sortChoices.length <= 1) return;
            return this.PopupChoiceView.create({
              iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAIUlEQVQ4y2NgGAVEg/9EAMo0DCFPU0/DIPc0bTSMArwAAI+/j3GjMHVsAAAAAElFTkSuQmCC',
              data$: this.data.sortOrder$,
              choices: this.data.sortChoices
            });
          }
        },
        {
          name: 'minWidth',
          getter: function() { return this.listView_.minWidth; }
        },
        {
          name: 'preferredWidth',
          getter: function() { return this.listView_.preferredWidth; }
        },
        {
          name: 'maxWidth',
          getter: function() { return this.listView_.maxWidth; }
        },
      ],

      actions: [
        {
          name: 'menuButton',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAGklEQVQ4y2NgGAVEg/9EAMo0jHp61NOjAAgAUWrXKeQhPE4AAAAASUVORK5CYII=',
          isAvailable: function() { return ! this.menuExpanded; },
          action: function() {
            this.menuOpen = true;
          }
        },
        {
          name: 'searchButton',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAvklEQVQ4Ec3BO4rCYBgAwA/NOf6gZ1jZRlDwVoreI4W9+DiS0VJTGytlthMCyZLSmYjvZuGk8lY5msf/ZLaaCll0s8XDUjKQW6lRRBcLPPzEh4kas2jnhGU0WOMQ7VRI0WCEW7TzxiAaDPGKdirk0WCMe7RzxCoabLCPduaoTeLDryem0UWB2trI0NjGE7voJlNo2uEqj25mDm5e7vamEa64yKMvuQtKKfqSK1FK0ZdcibMUfUlKZyn6k6T4Xn//4NdJ9ptTNwAAAABJRU5ErkJggg==',
          action: function() {
            this.searchMode = true;
          }
        },
        {
          name: 'backButton',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAPUlEQVQ4y2NgGLbgf8P/BtKU////+78WacpDSFMeSlPlYaQo/0OacjyAcg1wJ4WTGmHDS4sWaVrqhm/mBQAoLpX9t+4i2wAAAABJRU5ErkJggg==',
          action: function() {
            this.searchMode = false;
            this.data.search = '';
          }
        },
        {
          name: 'createButton',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAH0lEQVQ4y2NgGAUw8B8IRjXgUoQLUEfDaDyQqmF4AwADqmeZrHJtnQAAAABJRU5ErkJggg==',
          isAvailable: function() { return this.data.showAdd; },
          action: function() {
            this.stack.pushView(this.data.createView(null,
                this.Y.sub({ dao: this.data.dao })));
          }
        },
      ],

      listeners: [
        {
          name: 'onMenuTouch',
          code: function() {
            this.menuOpen = false;
          }
        },
      ],
      templates: [
        function CSS() {/*
          .hidden {
            display: none !important;
          }
          .expand {
            flex-grow: 1;
          }

          .browser {
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
          }
          .browser-header {
            align-items: center;
            color: #fff;
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
            height: 56px;
            padding: 0 12px;
          }
          .browser-header .title {
            font-size: 20px;
            font-weight: 500;
            margin-left: 12px;
          }

          .browser-header .browser-spinner {
            display: inline-block;
            height: 42px;
            overflow: hidden;
            width: 42px;
          }
          .browser-header .browser-spinner .spinner-fixed-box {
            height: 26px;
            width: 26px;
          }
          .browser-header .browser-spinner .spinner-circle {
            border-width: 3px;
          }

          .browser-header.search-header .md-text-field-input {
            color: #fff;
          }
          <% var prefixes = ['::-webkit-input', ':-moz', '::-moz', ':-ms-input'];
            for (var i = 0; i < prefixes.length; i++) { %>
              .browser-header.search-header .md-text-field-input><%= prefixes[i] %>-placeholder {
                color: #ccc;
              }
          <% } %>

          .browser-header .actionButtonCView {
            margin: 8px;
          }

          <% var ANIMATION_TIME = '0.4s'; %>

          .browser-menu-container {
            visibility: hidden;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            transition: visibility 0.01s linear <%= ANIMATION_TIME %>;
          }
          .browser-menu-container.menu-open {
            visibility: visible;
            transition: visibility <%= ANIMATION_TIME %> linear;
          }
          .browser-menu-inner {
            position: relative;
            height: 100%;
            width: 100%;
          }

          .browser-menu-overlay {
            background-color: #000;
            opacity: 0;
            position: absolute;
            height: 100%;
            top: 0;
            left: 0;
            width: 100%;
            transition: opacity <%= ANIMATION_TIME %> ease;
          }
          .menu-open .browser-menu-overlay {
            opacity: 0.4;
            transition: opacity <%= ANIMATION_TIME %> ease;
          }

          .browser-menu {
            background-color: #fff;
            position: absolute;
            height: 100%;
            top: 0;
            left: 0;
            transform: translate3d(-300px, 0, 0);
            overflow-y: auto;
            width: 300px;
            transition: transform <%= ANIMATION_TIME %> ease;
          }
          .menu-open .browser-menu {
            transform: translate3d(0, 0, 0);
            transition: transform <%= ANIMATION_TIME %> ease;
          }

          .browser-body {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow-x: hidden;
            overflow-y: auto;
          }
        */},
        function toHTML() {/*
          <div id="<%= this.id %>" <%= this.cssClassAttr() %>>
            <style>
              .browser-header-color { background-color: <%= this.data.headerColor %>; }
            </style>
            <div id="<%= this.id %>-menu-container" class="browser-menu-container">
              <div class="browser-menu-inner">
                <div id="<%= this.id %>-menu-overlay" class="browser-menu-overlay"></div>
                <div id="<%= this.id %>-menu-body" class="browser-menu"></div>
              </div>
            </div>
            <%
              this.setClass('menu-open', function() { return self.menuOpen; },
                  this.id + '-menu-container');
                  this.on('click', this.onMenuTouch, this.id + '-menu-overlay');
            %>


            <div id="<%= this.id %>-header" class="browser-header browser-header-color">
              $$menuButton
              $$title{ mode: 'read-only', extraClassName: 'expand title' }
              <% if ( this.spinner ) { %>
                <span class="browser-spinner">%%spinner</span>
              <% } %>
              <% for ( var i = 0; i < this.parent.model_.actions.length; i++) {
                var v = this.createActionView(this.parent.model_.actions[i]);
                v.data = this.parent;
                out(v);
              } %>
              $$searchButton
              <% if ( this.sortOrderView_ ) { %>
                <%= this.sortOrderView_ %>
              <% } %>
            </div>
            <div id="<%= this.id %>-header-search" class="browser-header search-header browser-header-color">
              $$backButton
              $$search{ extraClassName: 'expand search-field' }
            </div>
            <%
              this.setClass('hidden', function() { return self.searchMode; },
                  this.id + '-header');
              this.setClass('hidden', function() { return ! self.searchMode; },
                  this.id + '-header-search');
            %>
            <div class="browser-body">
              <%= this.listView_ = this.data.listView({ data$: this.data.filteredDAO$ }, this.Y) %>
            </div>
            <% if (this.data.showAdd) { %>
              <div class="floating-action">
                $$createButton{
                  className: 'createButton',
                  color: 'white',
                  font: '30px Roboto Arial',
                  alpha: 1,
                  width: 44,
                  height: 44,
                  radius: 22,
                  background: '#e51c23'
                }
              </div>
            <% } %>
          </div>
        */},
      ],
    },
  ],

  properties: [
    {
      name: 'touchManager',
      factory: function() {
        return this.X.touchManager || this.TouchManager.create();
      }
    },
    {
      name: 'gestureManager',
      factory: function() {
        return this.X.gestureManager || this.GestureManager.create();
      }
    },
    {
      name: 'stack',
      factory: function() {
        return this.StackView.create();
      }
    },
  ],

  methods: [
    function init(args) {
      this.SUPER(args);
      this.Y.registerModel(this.ActionButtonCView.xbind({
        height: 24,
        width: 24
      }), 'foam.ui.ActionButton');

      this.SharedStyles.create();
    },
    function toHTML() {
      return this.stack.toHTML();
    },
    function initHTML() {
      this.SUPER();
      this.stack.initHTML();
      this.stack.pushView_(-1, this.InnerBrowserView.create({
        parent: this,
        data: this.data
      }, this.Y));
    }
  ],
});
