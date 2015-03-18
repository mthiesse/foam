/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
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
  name: 'LabelStringProperty',
  package: 'foam.apps.quickbug.model',
  extendsModel: 'StringProperty',

  help: "A String value, taken from labels.",

  properties: [
    {
      name: 'preSet',
      defaultValue: function(o, n, prop) {
        return n ? n.intern() : n;
      }
    },
    {
      name: 'postSet',
      defaultValue: function(o, n, prop) {
        this.replaceLabels(prop.name.capitalize(), n);
      }
    },
    {
      name: 'transient',
      defaultValue: true
    }
  ]
});
