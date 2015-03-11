/*
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
   "model_": "Model",
   "package": "foam.ui.layout",
   "name": "PositionedViewTrait",
   "properties": [
      {
         "model_": "FloatProperty",
         "name": "x",
         "units": "px",
         "defaultValue": 0
      },
      {
         "model_": "FloatProperty",
         "name": "y",
         "units": "px",
         "defaultValue": 0
      },
      {
         "model_": "FloatProperty",
         "name": "z",
         "units": "px",
         "defaultValue": 0
      },
      {
         "model_": "IntProperty",
         "name": "width",
         "units": "px",
         "defaultValue": 100
      },
      {
         "model_": "IntProperty",
         "name": "height",
         "units": "px",
         "defaultValue": 100
      },
      {
         "model_": "IntProperty",
         "name": "preferredWidth",
         "units": "px",
         "defaultValue": 100
      },
      {
         "model_": "IntProperty",
         "name": "preferredHeight",
         "units": "px",
         "defaultValue": 100
      }
   ],
   "actions": [],
   "constants": [],
   "messages": [],
   "methods": [],
   "listeners": [],
   "templates": [],
   "models": [],
   "tests": [],
   "relationships": [],
   "issues": []
});
