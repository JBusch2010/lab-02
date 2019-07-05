'use strict';
/*global $ */

const HornedAnimal = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;

  HornedAnimal.allAnimals.push(this);
};

HornedAnimal.allAnimals = [];

HornedAnimal.prototype.renderWithHandlebars = function(){

  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);

  const newSectionHTML = template(this);

  $('.photo-template-placeholder').append(newSectionHTML);
};

HornedAnimal.prototype.renderWithHandlebars = function(){
  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);
  const newHtml = template(this);
  $('main').append(newHtml);
};

HornedAnimal.prototype.addToDropdown = function(){
  const source = $('#dropdown-template').html();
  const template = Handlebars.compile(source);

  const newDropdown = template(this);

  let alreadyThere = false;
  let keyword = this.keyword;

  $('select').children().each(function() {
    if (this.value === keyword){
      alreadyThere = true;
    }
  });

  if (alreadyThere === false) {
    $('select').append(newDropdown);
  }
};

HornedAnimal.filterAnimals = function(selected){
  let currentClass = $('.' + selected);
  let renderedAnimals = $('main').children();

  if (selected === 'default'){
    renderedAnimals.show();
  } else {
    renderedAnimals.hide();
    currentClass.show();
  }
};

HornedAnimal.makeNewHornedAnimal = function(animalJSON){
  animalJSON.forEach(animal => {
    new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns);
  });
};

HornedAnimal.getAllAnimals = function(){

  $.get('data/page-1.json', 'json').then(animalJSON => {

    this.makeNewHornedAnimal(animalJSON);

    this.allAnimals.forEach(animal => {
      animal.addToDropdown();
      animal.renderWithHandlebars();
    });

    $('select').change(function() {
      let selected = this.value;
      HornedAnimal.filterAnimals(selected);
    });
    HornedAnimal.filterAnimals('default');
  });

};

HornedAnimal.getAllAnimals();
