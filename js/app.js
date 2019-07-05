'use strict';
/*global $ */

const HornedAnimal = function(image_url, title, description, keyword, horns, file) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  this.file = file;
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

  $('#keyword-selector').children().each(function() {
    if (this.value === keyword){
      alreadyThere = true;
    }
  });

  if (alreadyThere === false) {
    $('#keyword-selector').append(newDropdown);
  }
};

HornedAnimal.filterAnimals = function(keySelected, pageSelected){
  let currentClass = $('.' + keySelected);
  let renderedAnimals = $('main').children();

  if (keySelected === 'default'){
    renderedAnimals.show();
  } else {
    renderedAnimals.hide();
    currentClass.show();
  }

  if (pageSelected === 'page-1') {
    $('.page-2').hide();
  } else {
    $('.page-1').hide();
  }
};

HornedAnimal.makeNewHornedAnimal = function(animalJSON, fileName){
  animalJSON.forEach(animal => {
    new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns, fileName);
  });
};

HornedAnimal.getAllAnimals = function(){

  $.get('data/page-1.json', 'json').then(animalJSON => {

    this.makeNewHornedAnimal(animalJSON, 'page-1');

    $.get('data/page-2.json', 'json').then(moreAnimalJSON => {

      this.makeNewHornedAnimal(moreAnimalJSON, 'page-2');

      this.allAnimals.forEach(animal => {
        animal.addToDropdown();
        animal.renderWithHandlebars();
      });

      $('select').change(function() {
        let keySelected = $('#keyword-selector').val();
        let pageSelected = $('#file-selector').val();
        console.log(pageSelected);

        HornedAnimal.filterAnimals(keySelected, pageSelected);
      });

      HornedAnimal.filterAnimals('default', 'page-1');
    });
  });

};

HornedAnimal.getAllAnimals();
