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


LOAD_CLASS({
  name: 'RelationshipsView',
  package: 'foam.ui',
  extendsModel: 'foam.ui.DetailView',

  documentation: function() {/* TODO: foam.ui.DetailView has some trouble requiring this,
    perhaps due to this extending it... */},
  templates: [
    function toHTML() {/*
      <%
        for ( var i = 0, relationship; relationship = this.model.relationships[i]; i++ ) {
          out(this.X.RelationshipView.create({
            data$: this.data$,
            relationship: relationship
          }));
        }
      %>
    */}
  ]
});
